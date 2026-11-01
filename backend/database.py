import os
from pathlib import Path

from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent

load_dotenv(PROJECT_ROOT / ".env")


# ==============================
# MONGODB CONFIGURATION
# ==============================

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://127.0.0.1:27017"
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "smartgrievance"
)


# ==============================
# MONGODB CONNECTION
# ==============================

client = MongoClient(MONGO_URI)

db = client[DATABASE_NAME]


# ==============================
# COLLECTIONS
# ==============================

users_collection = db["users"]

complaints_collection = db["complaints"]

departments_collection = db["departments"]

notifications_collection = db["notifications"]

ai_predictions_collection = db["ai_predictions"]

audit_logs_collection = db["audit_logs"]


# ==============================
# USER EMAIL INDEX
# ==============================

users_collection.create_index(
    [("email", ASCENDING)],
    unique=True
)

complaints_collection.create_index([
    ("student_id", ASCENDING)
])
complaints_collection.create_index([
    ("status", ASCENDING)
])
complaints_collection.create_index([
    ("category", ASCENDING)
])
complaints_collection.create_index([
    ("priority", ASCENDING)
])
complaints_collection.create_index([
    ("created_at", -1)
])

notifications_collection.create_index([
    ("user_id", ASCENDING)
])
notifications_collection.create_index([
    ("created_at", -1)
])

audit_logs_collection.create_index([
    ("user_id", ASCENDING)
])
audit_logs_collection.create_index([
    ("created_at", -1)
])

print("MongoDB connection initialized")