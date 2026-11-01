import re

CATEGORY_KEYWORDS = {
    "Hostel": [
        "hostel",
        "room",
        "warden",
        "water",
        "bathroom",
        "bed",
        "hostel food",
        "accommodation",
    ],
    "Library": [
        "library",
        "book",
        "books",
        "librarian",
        "reading room",
    ],
    "Fees": [
        "fee",
        "fees",
        "payment",
        "scholarship",
        "refund",
        "receipt",
    ],
    "Exam": [
        "exam",
        "examination",
        "marks",
        "result",
        "question paper",
        "hall ticket",
        "timetable",
    ],
    "Transport": [
        "bus",
        "transport",
        "driver",
        "vehicle",
        "route",
    ],
    "Canteen": [
        "canteen",
        "food",
        "breakfast",
        "lunch",
        "dinner",
        "meal",
    ],
    "Wi-Fi": [
        "wifi",
        "wi-fi",
        "internet",
        "network",
        "connection",
    ],
    "Classroom": [
        "classroom",
        "class",
        "bench",
        "projector",
        "fan",
        "light",
        "ac",
    ],
}


def classify_complaint(text):
    text = (text or "").lower()
    scores = {}

    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if keyword in text:
                score += 1
        scores[category] = score

    best_category = max(scores, key=scores.get)
    best_score = scores[best_category]

    if best_score == 0:
        return {
            "category": "General",
            "confidence": 0.55,
        }

    confidence = min(0.60 + (best_score * 0.08), 0.95)
    return {
        "category": best_category,
        "confidence": round(confidence, 2),
    }
