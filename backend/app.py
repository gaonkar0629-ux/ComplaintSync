import os
import re
import secrets
import shutil
import uuid
from datetime import datetime, timezone
from functools import wraps
from io import BytesIO
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, make_response, redirect, request, send_from_directory, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
from PIL import Image, UnidentifiedImageError
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from werkzeug.utils import secure_filename
import pytesseract
from pytesseract import TesseractError, TesseractNotFoundError

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from predictor import analyze_complaint
from sentiment import analyze_sentiment
from routing import get_department
from duplicate import find_duplicate

from database import (
    client,
    users_collection,
    complaints_collection,
    notifications_collection,
    ai_predictions_collection,
    audit_logs_collection,
    db
)
FRONTEND_DIRECTORY = os.path.join(os.path.dirname(__file__), "..", "frontend")
SESSION_DIRECTORY = os.path.join(os.path.dirname(__file__), ".flask_session")
UPLOAD_FOLDER = Path(__file__).resolve().parent / "uploads"
ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024
SESSION_SECRET = os.getenv("SESSION_SECRET") or os.getenv("SECRET_KEY")
app = Flask(
    __name__,
    static_folder=FRONTEND_DIRECTORY,
    static_url_path="",
)

app.config.update(
    SECRET_KEY=SESSION_SECRET or secrets.token_urlsafe(32),
    SESSION_TYPE="filesystem",
    SESSION_FILE_DIR=SESSION_DIRECTORY,
    SESSION_PERMANENT=False,
    SESSION_USE_SIGNER=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "false").lower() in {
        "1",
        "true",
        "yes",
    },
    MAX_CONTENT_LENGTH=MAX_IMAGE_SIZE + 1024 * 1024,
)
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)

tesseract_command = os.getenv("TESSERACT_CMD") or shutil.which("tesseract")
if tesseract_command:
    pytesseract.pytesseract.tesseract_cmd = tesseract_command
elif os.path.isfile(r"C:\Program Files\Tesseract-OCR\tesseract.exe"):
    pytesseract.pytesseract.tesseract_cmd = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )
if not SESSION_SECRET:
    app.logger.warning(
        "SESSION_SECRET is unset; sessions will be invalidated when the app restarts."
    )

Session(app)
bcrypt = Bcrypt(app)
CORS(app)

PROTECTED_FRONTEND_PAGES = {
    "dashboard.html",
    "complaint.html",
    "my-complaints.html",
    "notifications.html",
    "ai-assistant.html",
    "settings.html",
    "admin.html",
}


@app.before_request
def protect_frontend_pages():
    page = request.path.lstrip("/")
    if page in PROTECTED_FRONTEND_PAGES:
        if not session.get("user_id"):
            return redirect("/login.html")
        if page == "admin.html" and str(session.get("role", "")).lower() != "admin":
            return redirect("/dashboard.html")
    return None


def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if not session.get("user_id"):
            return jsonify({"error": "Authentication is required."}), 401
        return view(*args, **kwargs)

    return wrapped_view


def clean_text(value, max_length=2000):
    if value is None:
        return ""
    text = str(value).strip()
    if len(text) > max_length:
        text = text[:max_length]
    return text


def valid_email(email):
    return isinstance(email, str) and bool(re.fullmatch(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email.strip()))


def create_audit_log(user_id, action, description):
    try:
        audit_logs_collection.insert_one({
            "user_id": user_id,
            "action": action,
            "description": description,
            "created_at": datetime.now(timezone.utc),
        })
    except Exception:
        app.logger.exception("Unable to write audit log for %s", user_id)


def admin_required():
    user_id = session.get("user_id")
    if not user_id:
        return False
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        app.logger.exception("Unable to verify admin account for session user %s", user_id)
        return False

    if not user:
        return False
    if str(user.get("role", "")).lower() != "admin":
        return False
    if str(user.get("status", "inactive")).lower() != "active":
        return False
    return True


def allowed_image(filename):
    return (
        isinstance(filename, str)
        and "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
    )


def extract_text_from_image(image_stream):
    warning = None
    try:
        image_stream.seek(0)
        with Image.open(image_stream) as image:
            extracted_text = pytesseract.image_to_string(image).strip()
        return extracted_text, warning
    except TesseractNotFoundError:
        app.logger.warning(
            "Tesseract is unavailable. Configure TESSERACT_CMD to enable OCR."
        )
        warning = "Image saved, but OCR is unavailable. Install Tesseract and configure TESSERACT_CMD."
    except TesseractError:
        app.logger.exception("Tesseract could not extract text from uploaded image")
        warning = "Image saved, but OCR could not read text from it."
    return "", warning


@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(404)
def not_found(_error):
    return jsonify({
        "success": False,
        "message": "Resource not found.",
    }), 404


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify({
        "success": False,
        "message": "The upload is too large. Evidence images must be 5 MB or smaller.",
    }), 413


@app.errorhandler(500)
def internal_error(_error):
    return jsonify({
        "success": False,
        "message": "Internal server error.",
    }), 500


@app.route("/uploads/<filename>", methods=["GET"])
@login_required
def uploaded_file(filename):
    safe_filename = secure_filename(filename)
    if (
        safe_filename != filename
        or not re.fullmatch(r"[a-f0-9]{32}\.(?:png|jpe?g|webp)", filename)
    ):
        return jsonify({"error": "Evidence image not found."}), 404

    ownership_filter = {"evidence.filename": filename}
    if str(session.get("role", "")).lower() != "admin":
        ownership_filter["student_id"] = session["user_id"]

    if not complaints_collection.find_one(ownership_filter, {"_id": 1}):
        return jsonify({"error": "Evidence image not found."}), 404

    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/api/health", methods=["GET"])
def health():
    try:
        db.command("ping")
        return jsonify({
            "success": True,
            "status": "online",
            "database": "connected"
        }), 200
    except Exception:
        app.logger.exception("Health check failed")
        return jsonify({
            "success": False,
            "status": "offline",
            "database": "disconnected",
        }), 503


def complaint_for_response(complaint):
    student = complaint.get("student")
    student = student if isinstance(student, dict) else {}
    evidence = complaint.get("evidence")
    evidence_filename = (
        evidence.get("filename")
        if isinstance(evidence, dict)
        else None
    )
    if (
        isinstance(evidence_filename, str)
        and re.fullmatch(
            r"[a-f0-9]{32}\.(?:png|jpe?g|webp)",
            evidence_filename,
        )
    ):
        evidence = {
            "filename": evidence_filename,
            "url": f"/uploads/{evidence_filename}",
        }
    else:
        evidence = None

    created_at = complaint.get("created_at") or complaint.get("createdAt") or complaint.get("submitted_at")
    if hasattr(created_at, "isoformat"):
        created_at = created_at.isoformat()
    elif created_at is None:
        created_at = ""

    return {
        "id": str(complaint.get("_id", "")),
        "student_name": complaint.get("student_name") or complaint.get("studentName") or student.get("name") or "",
        "department": complaint.get("department") or student.get("department") or "",
        "title": complaint.get("title") or complaint.get("complaint", ""),
        "description": complaint.get("description") or complaint.get("details", ""),
        "summary": complaint.get("summary") or (complaint.get("description") or complaint.get("details", ""))[:300],
        "location": complaint.get("location", ""),
        "category": complaint.get("category", "General"),
        "priority": complaint.get("priority", "Low"),
        "priority_confidence": complaint.get("priority_confidence", 0),
        "input_type": complaint.get("input_type", "text"),
        "voice_used": bool(complaint.get("voice_used", False)),
        "status": complaint.get("status", "Pending"),
        "sentiment": complaint.get("sentiment", "Normal"),
        "responsible_department": complaint.get("responsible_department", complaint.get("department", "Administration Department")),
        "category_confidence": complaint.get("category_confidence", 0),
        "is_duplicate": complaint.get("is_duplicate", False),
        "duplicate_similarity": complaint.get("duplicate_similarity", 0),
        "ocr_text": complaint.get("ocr_text", ""),
        "evidence": evidence,
        "created_at": created_at,
    }


def excel_safe_cell(value):
    text = str(value or "")
    if text.startswith(("=", "+", "-", "@", "\t", "\r")):
        return "'" + text
    return text


@app.route("/api/register", methods=["POST"])
def register_user():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "A JSON registration object is required."}), 400

    required_fields = ("name", "email", "password", "department")
    user_data = {
        field: clean_text(payload.get(field), 200)
        for field in required_fields
    }
    missing_fields = [field for field, value in user_data.items() if not value]
    if missing_fields:
        return jsonify({
            "error": "Required fields are missing.",
            "fields": missing_fields,
        }), 400

    email = user_data["email"].lower()
    if not valid_email(email):
        return jsonify({"error": "Please provide a valid email address."}), 400

    password = str(payload.get("password", ""))
    if len(password) < 8:
        return jsonify({"error": "Password must contain at least 8 characters."}), 400
    if not re.search(r"[A-Z]", password):
        return jsonify({"error": "Password must contain one uppercase letter."}), 400
    if not re.search(r"[a-z]", password):
        return jsonify({"error": "Password must contain one lowercase letter."}), 400
    if not re.search(r"\d", password):
        return jsonify({"error": "Password must contain one number."}), 400

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "An account with this email already exists."}), 409

    user_document = {
        "name": user_data["name"],
        "email": email,
        "role": "student",
        "department": user_data["department"],
        "preferred_language": clean_text(payload.get("preferred_language", "en"), 20) or "en",
        "password_hash": bcrypt.generate_password_hash(password).decode("utf-8"),
        "created_at": datetime.now(timezone.utc),
        "status": "active",
    }

    try:
        result = users_collection.insert_one(user_document)
        return jsonify({
            "message": "Account created successfully.",
            "user": {
                "id": str(result.inserted_id),
                "name": user_document["name"],
                "email": user_document["email"],
                "role": user_document["role"],
            },
        }), 201
    except DuplicateKeyError:
        return jsonify({"error": "An account with this email already exists."}), 409
    except Exception:
        app.logger.exception("Unable to create user account")
        return jsonify({"error": "Unable to create the user account."}), 503


@app.route("/api/login", methods=["POST"])
def login_user():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "A JSON login object is required."}), 400

    email = payload.get("email")
    password = payload.get("password")
    if (
        not isinstance(email, str)
        or not email.strip()
        or not isinstance(password, str)
        or not password
    ):
        return jsonify({"error": "Email and password are required."}), 400

    email = email.strip().lower()
    try:
        user = users_collection.find_one({"email": email})
    except Exception:
        app.logger.exception("Unable to look up user during login")
        return jsonify({"error": "Unable to log in right now."}), 503

    password_hash = user.get("password_hash") if user else None
    if not isinstance(password_hash, str):
        return jsonify({"error": "Invalid email or password."}), 401

    if user.get("status", "active") != "active":
        return jsonify({"error": "Your account is not active."}), 403

    try:
        password_matches = bcrypt.check_password_hash(password_hash, password)
    except (TypeError, ValueError):
        app.logger.exception("Stored password hash is invalid for user %s", email)
        password_matches = False

    if not password_matches:
        return jsonify({"error": "Invalid email or password."}), 401

    create_audit_log(str(user["_id"]), "LOGIN", f"User logged in: {email}")
    session.clear()
    session["user_id"] = str(user["_id"])
    session["name"] = user.get("name", "")
    session["email"] = user.get("email", "")
    session["role"] = user.get("role", "student")
    session["department"] = user.get("department", "")
    session["preferred_language"] = user.get("preferred_language", "en")
    app.session_interface.regenerate(session)
    return jsonify({
        "success": True,
        "message": "Login successful.",
        "user": {
            "name": session["name"],
            "email": session["email"],
            "role": session["role"],
            "department": session["department"],
        },
    }), 200


@app.route("/api/me", methods=["GET"])
def current_user():
    if not session.get("user_id"):
        return jsonify({"authenticated": False}), 401
    return jsonify({
        "authenticated": True,
        "user": {
            "id": session["user_id"],
            "name": session.get("name", ""),
            "email": session.get("email", ""),
            "role": session.get("role", "student"),
            "department": session.get("department", ""),
            "preferred_language": session.get("preferred_language", "en"),
        },
    }), 200


@app.route("/api/logout", methods=["POST"])
def api_logout():
    user_id = session.get("user_id")
    if user_id:
        create_audit_log(user_id, "LOGOUT", "User logged out from the API")
    session.clear()
    return jsonify({"success": True, "message": "Logged out successfully."}), 200


@app.route("/logout")
def logout():
    user_id = session.get("user_id")
    if user_id:
        create_audit_log(user_id, "LOGOUT", "User logged out from the web app")
    session.clear()
    return redirect("/login.html")


@app.route("/api/admin/dashboard", methods=["GET"])
def admin_dashboard():
    if not admin_required():
        return jsonify({
            "success": False,
            "error": "Admin access required."
        }), 403

    try:
        total = complaints_collection.count_documents({})
        pending = complaints_collection.count_documents({"status": "Pending"})
        in_progress = complaints_collection.count_documents({"status": "In Progress"})
        resolved = complaints_collection.count_documents({"status": "Resolved"})
        high_priority = complaints_collection.count_documents({"priority": {"$in": ["High", "high"]}})
        critical_priority = complaints_collection.count_documents({"priority": {"$in": ["Critical", "critical"]}})

        resolution_times = []
        complaints = complaints_collection.find({
            "status": "Resolved",
            "created_at": {"$exists": True},
            "resolved_at": {"$exists": True},
        })
        for complaint in complaints:
            created_at = complaint.get("created_at")
            resolved_at = complaint.get("resolved_at")
            if created_at and resolved_at and hasattr(created_at, "timestamp") and hasattr(resolved_at, "timestamp"):
                resolution_times.append((resolved_at - created_at).total_seconds() / 3600)

        average_resolution_hours = 0.0
        if resolution_times:
            average_resolution_hours = round(sum(resolution_times) / len(resolution_times), 2)

        return jsonify({
            "success": True,
            "statistics": {
                "total": total,
                "pending": pending,
                "in_progress": in_progress,
                "resolved": resolved,
                "high_priority": high_priority,
                "critical_priority": critical_priority,
                "average_resolution_hours": average_resolution_hours,
            },
        }), 200
    except Exception:
        app.logger.exception("Unable to load admin dashboard")
        return jsonify({
            "success": False,
            "error": "Unable to load dashboard."
        }), 503


@app.route("/api/admin/complaints", methods=["GET"])
def admin_get_complaints():
    if not admin_required():
        return jsonify({
            "success": False,
            "error": "Admin access required."
        }), 403

    try:
        complaints = complaints_collection.find({}).sort("created_at", -1)
        result = []
        for complaint in complaints:
            record = complaint_for_response(complaint)
            record["student_email"] = complaint.get("student_email") or complaint.get("studentEmail") or ""
            record["student_department"] = complaint.get("student_department") or complaint.get("studentDepartment") or complaint.get("department") or record.get("department", "")
            record["department"] = complaint.get("department") or record.get("department", "")
            result.append(record)

        return jsonify({
            "success": True,
            "complaints": result,
            "count": len(result),
        }), 200
    except Exception:
        app.logger.exception("Unable to retrieve admin complaints")
        return jsonify({
            "success": False,
            "error": "Unable to retrieve complaints."
        }), 503


@app.route("/api/admin/complaints/<complaint_id>", methods=["PATCH"])
def admin_update_complaint(complaint_id):
    if not admin_required():
        return jsonify({
            "success": False,
            "error": "Admin access required."
        }), 403

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({
            "success": False,
            "error": "Invalid request data."
        }), 400

    allowed_statuses = ["Pending", "In Progress", "Resolved"]
    status = payload.get("status")
    department = payload.get("department")

    if status is not None:
        status = str(status).strip()
        if status not in allowed_statuses:
            return jsonify({
                "success": False,
                "error": "Invalid complaint status."
            }), 400

    try:
        if not ObjectId.is_valid(complaint_id):
            return jsonify({
                "success": False,
                "error": "Invalid complaint ID."
            }), 400

        complaint = complaints_collection.find_one({"_id": ObjectId(complaint_id)})
        if not complaint:
            return jsonify({
                "success": False,
                "error": "Complaint not found."
            }), 404

        old_status = str(complaint.get("status", "Pending") or "Pending")
        old_department = str(complaint.get("department", "") or "")
        update_data = {}

        if status is not None and status != old_status:
            update_data["status"] = status
            if status == "Resolved":
                update_data["resolved_at"] = datetime.now(timezone.utc)
        if department is not None:
            department = str(department).strip()
            if not department:
                return jsonify({
                    "success": False,
                    "error": "Department is required."
                }), 400
            if department != old_department:
                update_data["department"] = department

        if not update_data:
            return jsonify({
                "success": True,
                "message": "Complaint already in the requested state."
            }), 200

        update_data["updated_at"] = datetime.now(timezone.utc)
        complaints_collection.update_one(
            {"_id": ObjectId(complaint_id)},
            {"$set": update_data},
        )

        create_audit_log(
            session["user_id"],
            "COMPLAINT_UPDATED",
            f"Admin changed complaint {complaint_id} to status={status or old_status} and department={department or old_department}",
        )

        student_id = complaint.get("student_id")
        notifications = []
        if student_id:
            if status is not None and status != old_status:
                notifications.append({
                    "user_id": student_id,
                    "complaint_id": complaint_id,
                    "title": "Complaint Status Updated",
                    "message": f'Your complaint "{complaint.get("title", "")}" has been changed from {old_status} to {status}.',
                    "type": "status",
                    "is_read": False,
                    "created_at": datetime.now(timezone.utc),
                })
            if department is not None and department != old_department:
                notifications.append({
                    "user_id": student_id,
                    "complaint_id": complaint_id,
                    "title": "Complaint Department Updated",
                    "message": f'Your complaint "{complaint.get("title", "")}" has been assigned to {department} department.',
                    "type": "department",
                    "is_read": False,
                    "created_at": datetime.now(timezone.utc),
                })
            if notifications:
                notifications_collection.insert_many(notifications)

        return jsonify({
            "success": True,
            "message": "Complaint updated successfully."
        }), 200
    except Exception:
        app.logger.exception("Unable to update complaint")
        return jsonify({
            "success": False,
            "error": "Unable to update complaint."
        }), 500


@app.route("/api/notifications", methods=["GET"])
@login_required
def get_notifications():
    try:
        notifications = list(notifications_collection.find({
            "user_id": session["user_id"]
        }).sort("created_at", -1))

        result = []
        for notification in notifications:
            created_at = notification.get("created_at")
            result.append({
                "id": str(notification.get("_id", "")),
                "title": notification.get("title", ""),
                "message": notification.get("message", ""),
                "type": notification.get("type", "info"),
                "is_read": bool(notification.get("is_read", False)),
                "created_at": created_at.isoformat() if hasattr(created_at, "isoformat") else None,
            })

        return jsonify({
            "success": True,
            "notifications": result,
        }), 200
    except Exception:
        app.logger.exception("Unable to load notifications")
        return jsonify({
            "success": False,
            "error": "Unable to load notifications."
        }), 503


@app.route("/api/notifications/<notification_id>/read", methods=["PATCH"])
@login_required
def mark_notification_read(notification_id):
    try:
        if not ObjectId.is_valid(notification_id):
            return jsonify({
                "success": False,
                "message": "Invalid notification ID"
            }), 400

        result = notifications_collection.update_one(
            {"_id": ObjectId(notification_id), "user_id": session["user_id"]},
            {"$set": {"is_read": True}},
        )

        if result.matched_count == 0:
            return jsonify({
                "success": False,
                "message": "Notification not found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Notification marked as read"
        }), 200
    except Exception:
        app.logger.exception("Unable to mark notification as read")
        return jsonify({
            "success": False,
            "message": "Invalid notification ID"
        }), 400


@app.route("/api/complaints", methods=["GET"])
@login_required
def list_complaints():
    try:
        complaints = complaints_collection.find({
            "student_id": session["user_id"],
        }).sort("created_at", -1)
        records = [complaint_for_response(item) for item in complaints]
        return jsonify({
            "success": True,
            "complaints": records,
            "count": len(records),
        })
    except Exception:
        app.logger.exception("Unable to load complaints for current user")
        return jsonify({"error": "Unable to load your complaints from the database."}), 503


@app.route("/api/ai/chat", methods=["POST"])
@login_required
def ai_chat():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({
            "success": False,
            "message": "A JSON message is required.",
        }), 400

    message = payload.get("message")
    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "success": False,
            "message": "Please describe your complaint.",
        }), 400

    complaint_text = message.strip()
    if len(complaint_text) > 2000:
        return jsonify({
            "success": False,
            "message": "Please keep your complaint under 2,000 characters.",
        }), 400

    try:
        analysis = analyze_complaint(complaint_text)
        category = analysis["category"]
        priority = analysis["priority"]
        department = get_department(category)
        return jsonify({
            "success": True,
            "reply": (
                f"I analyzed your complaint as {category} with {priority} priority. "
                f"The suggested department is {department}. Add the exact location "
                "below, then submit it when you are ready."
            ),
            "analysis": {
                "category": category,
                "category_confidence": analysis["category_confidence"],
                "priority": priority,
                "priority_confidence": analysis["priority_confidence"],
                "department": department,
            },
        }), 200
    except Exception:
        app.logger.exception("Unable to analyze chatbot complaint")
        return jsonify({
            "success": False,
            "message": "Unable to analyze this complaint right now.",
        }), 503


@app.route("/api/complaints", methods=["POST"])
@login_required
def create_complaint():
    if "user_id" not in session:
        return jsonify({
            "success": False,
            "message": "Please login first"
        }), 401

    try:
        user = users_collection.find_one({"_id": ObjectId(session["user_id"])})
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found"
            }), 404

        if request.mimetype == "multipart/form-data":
            data = request.form
        else:
            data = request.get_json(silent=True)
            if not isinstance(data, dict):
                return jsonify({
                    "success": False,
                    "message": "Complaint data must be a valid form or JSON object.",
                }), 400

        title = clean_text(data.get("title"), 200)
        description = clean_text(data.get("description"), 5000)
        location = clean_text(data.get("location"), 300)

        if not title or not description:
            return jsonify({
                "success": False,
                "message": "Title and description are required"
            }), 400

        submitted_input_type = str(data.get("input_type", "text")).strip().lower()
        if submitted_input_type not in {"text", "voice"}:
            return jsonify({
                "success": False,
                "message": "Input type must be text or voice.",
            }), 400

        image_file = request.files.get("evidence")
        image_filename = None
        image_url = None
        ocr_text = ""
        ocr_warning = None
        image_path = None

        if image_file and image_file.filename:
            original_name = secure_filename(image_file.filename)
            if not allowed_image(original_name):
                return jsonify({
                    "success": False,
                    "message": "Only PNG, JPG, JPEG, and WEBP evidence images are allowed.",
                }), 400

            image_bytes = image_file.stream.read(MAX_IMAGE_SIZE + 1)
            if len(image_bytes) > MAX_IMAGE_SIZE:
                return jsonify({
                    "success": False,
                    "message": "Evidence images must be 5 MB or smaller.",
                }), 400
            image_file.stream.seek(0)

            try:
                with Image.open(image_file.stream) as image:
                    image_format = (image.format or "").upper()
                    extension = original_name.rsplit(".", 1)[1].lower()
                    expected_formats = {
                        "png": {"PNG"},
                        "jpg": {"JPEG"},
                        "jpeg": {"JPEG"},
                        "webp": {"WEBP"},
                    }
                    if image_format not in expected_formats[extension]:
                        raise ValueError("Unsupported image format.")
                    if image.width * image.height > 20_000_000:
                        return jsonify({
                            "success": False,
                            "message": "Evidence image dimensions are too large.",
                        }), 400
                    image.verify()
                image_file.stream.seek(0)
            except (
                UnidentifiedImageError,
                Image.DecompressionBombError,
                OSError,
                ValueError,
            ):
                return jsonify({
                    "success": False,
                    "message": "The uploaded file is not a valid PNG, JPG, JPEG, or WEBP image.",
                }), 400

            image_file.stream.seek(0)
            ocr_text, ocr_warning = extract_text_from_image(image_file.stream)
            extension = original_name.rsplit(".", 1)[1].lower()
            image_filename = f"{uuid.uuid4().hex}.{extension}"
            image_path = UPLOAD_FOLDER / image_filename
            image_url = f"/uploads/{image_filename}"

        input_type = (
            "voice_image" if submitted_input_type == "voice" and image_filename
            else "voice" if submitted_input_type == "voice"
            else "image" if image_filename
            else "text"
        )
        complaint_text = (title + " " + description + " " + ocr_text).strip()

        ml_result = analyze_complaint(complaint_text)
        category = ml_result["category"]
        category_confidence = float(ml_result.get("category_confidence", 0.0))
        sentiment = analyze_sentiment(complaint_text)
        priority = ml_result["priority"]
        priority_confidence = float(ml_result.get("priority_confidence", 0.0))
        responsible_department = get_department(category)

        existing_complaints = list(complaints_collection.find({}, {"title": 1, "description": 1}).limit(100))
        duplicate_result = find_duplicate(complaint_text, existing_complaints)

        now = datetime.now(timezone.utc)
        complaint = {
            "student_id": session["user_id"],
            "student_name": user.get("name", ""),
            "student_email": user.get("email", ""),
            "student_department": user.get("department", ""),
            "title": title,
            "description": description,
            "summary": description[:200],
            "input_type": input_type,
            "voice_used": submitted_input_type == "voice",
            "ocr_text": ocr_text,
            "evidence": {
                "filename": image_filename,
                "url": image_url,
            } if image_filename else None,
            "location": location,
            "category": category,
            "category_confidence": category_confidence,
            "priority": priority,
            "priority_confidence": priority_confidence,
            "sentiment": sentiment,
            "responsible_department": responsible_department,
            "is_duplicate": duplicate_result["is_duplicate"],
            "duplicate_similarity": duplicate_result["similarity"],
            "duplicate_complaint_id": duplicate_result["complaint_id"],
            "department": user.get("department", ""),
            "status": "Pending",
            "created_at": now,
            "updated_at": now,
        }

        if image_file and image_filename and image_path:
            image_file.stream.seek(0)
            try:
                image_file.save(image_path)
            except Exception:
                if image_path.exists():
                    image_path.unlink()
                raise

        try:
            result = complaints_collection.insert_one(complaint)
        except Exception:
            if image_path and image_path.exists():
                image_path.unlink()
            raise

        model_components = ["TF-IDF + Logistic Regression"]
        if image_filename:
            model_components.append("OCR")
        if submitted_input_type == "voice":
            model_components.append("Browser Speech Recognition")

        ai_predictions_collection.insert_one({
            "complaint_id": str(result.inserted_id),
            "model_type": " + ".join(model_components),
            "category": category,
            "category_confidence": category_confidence,
            "priority": priority,
            "priority_confidence": priority_confidence,
            "sentiment": sentiment,
            "ocr_used": bool(ocr_text),
            "voice_used": submitted_input_type == "voice",
            "image_used": bool(image_filename),
            "input_type": input_type,
            "responsible_department": responsible_department,
            "is_duplicate": duplicate_result["is_duplicate"],
            "duplicate_similarity": duplicate_result["similarity"],
            "created_at": now,
        })

        create_audit_log(
            session["user_id"],
            "COMPLAINT_CREATED",
            f"Student created complaint {result.inserted_id} with category {category}",
        )

        notifications_collection.insert_one({
            "user_id": session["user_id"],
            "complaint_id": str(result.inserted_id),
            "title": "Complaint Submitted",
            "message": f'Your complaint "{title}" was submitted successfully. Category: {category}. Priority: {priority}.',
            "type": "complaint",
            "is_read": False,
            "created_at": now,
        })

        return jsonify({
            "success": True,
            "message": "Complaint submitted successfully",
            "complaint_id": str(result.inserted_id),
            "input_type": input_type,
            "ai": {
                "category": category,
                "category_confidence": category_confidence,
                "priority": priority,
                "priority_confidence": priority_confidence,
                "sentiment": sentiment,
                "department": responsible_department,
                "is_duplicate": duplicate_result["is_duplicate"],
                "duplicate_similarity": duplicate_result["similarity"],
            },
            "evidence": {
                "filename": image_filename,
                "url": image_url,
                "ocr_text": ocr_text,
            } if image_filename else None,
            "ocr_warning": ocr_warning,
        }), 201
    except Exception as e:
        app.logger.exception("Complaint creation error")
        return jsonify({
            "success": False,
            "message": "Failed to submit complaint"
        }), 500


@app.route("/api/complaints/<complaint_id>/history", methods=["GET"])
@login_required
def get_complaint_history(complaint_id):
    try:
        if not ObjectId.is_valid(complaint_id):
            return jsonify({
                "success": False,
                "message": "Invalid complaint ID"
            }), 400

        complaint = complaints_collection.find_one({
            "_id": ObjectId(complaint_id),
            "student_id": session["user_id"],
        })

        if not complaint:
            return jsonify({
                "success": False,
                "message": "Complaint not found"
            }), 404

        history = []
        created_at = complaint.get("created_at")
        history.append({
            "status": "Complaint Submitted",
            "message": "Complaint was successfully submitted.",
            "date": created_at.isoformat() if hasattr(created_at, "isoformat") else None,
        })

        current_status = complaint.get("status", "Pending")
        if current_status in ["In Progress", "Resolved"]:
            updated_at = complaint.get("updated_at")
            history.append({
                "status": current_status,
                "message": f"Complaint status is now {current_status}.",
                "date": updated_at.isoformat() if hasattr(updated_at, "isoformat") else None,
            })

        return jsonify({
            "success": True,
            "history": history
        }), 200
    except Exception:
        app.logger.exception("Unable to load complaint history")
        return jsonify({
            "success": False,
            "message": "Invalid complaint ID"
        }), 400


@app.route("/api/complaints/export.xlsx", methods=["GET"])
@login_required
def export_complaints():
    headers = (
        "Student Name",
        "Student Email",
        "Department",
        "Complaint Title",
        "Description",
        "Category",
        "Priority",
        "Sentiment",
        "Responsible Department",
        "Status",
        "Location",
        "Created Date",
        "Updated Date",
        "Resolved Date",
        "Input Type",
        "OCR Used",
        "Evidence",
    )

    try:
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Complaint History"
        sheet.append(headers)
        for cell in sheet[1]:
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill("solid", fgColor="0B1222")
        sheet.freeze_panes = "A2"

        complaints = complaints_collection.find({
            "student_id": session["user_id"],
        }).sort("created_at", -1)
        for item in complaints:
            record = complaint_for_response(item)
            relevant_dates = {
                "created": item.get("created_at"),
                "updated": item.get("updated_at"),
                "resolved": item.get("resolved_at"),
            }
            sheet.append([
                excel_safe_cell(record["student_name"]),
                excel_safe_cell(item.get("student_email") or ""),
                excel_safe_cell(record["department"]),
                excel_safe_cell(record["title"]),
                excel_safe_cell(record["description"]),
                excel_safe_cell(record["category"]),
                excel_safe_cell(record["priority"]),
                excel_safe_cell(record.get("sentiment") or "Normal"),
                excel_safe_cell(record.get("responsible_department") or ""),
                excel_safe_cell(record["status"]),
                excel_safe_cell(record["location"]),
                excel_safe_cell(relevant_dates["created"].isoformat() if hasattr(relevant_dates["created"], "isoformat") else relevant_dates["created"]),
                excel_safe_cell(relevant_dates["updated"].isoformat() if hasattr(relevant_dates["updated"], "isoformat") else relevant_dates["updated"]),
                excel_safe_cell(relevant_dates["resolved"].isoformat() if hasattr(relevant_dates["resolved"], "isoformat") else relevant_dates["resolved"]),
                excel_safe_cell(record.get("input_type") or "text"),
                excel_safe_cell("Yes" if record.get("ocr_text") else "No"),
                excel_safe_cell(record.get("evidence", {}).get("url") if isinstance(record.get("evidence"), dict) else ""),
            ])

        sheet.auto_filter.ref = sheet.dimensions
        column_widths = (24, 28, 20, 30, 52, 18, 14, 16, 24, 16, 22, 22, 22, 22, 16, 12, 40)
        for index, width in enumerate(column_widths, start=1):
            sheet.column_dimensions[chr(64 + index)].width = width

        output = BytesIO()
        workbook.save(output)
        response = make_response(output.getvalue())
        response.headers["Content-Type"] = (
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response.headers["Content-Disposition"] = (
            'attachment; filename="student-complaint-history.xlsx"'
        )
        return response
    except Exception:
        app.logger.exception("Unable to export complaint history")
        return jsonify({"error": "Unable to export complaint history from the database."}), 503


if __name__ == "__main__":
    app.run(
        debug=True,
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "5000")),
        use_reloader=False,
    )