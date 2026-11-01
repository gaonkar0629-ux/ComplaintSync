CRITICAL_WORDS = [
    "fire",
    "accident",
    "danger",
    "dangerous",
    "emergency",
    "life threatening",
    "electric shock",
]

HIGH_WORDS = [
    "urgent",
    "immediately",
    "not working",
    "unsafe",
    "security",
    "harassment",
    "water problem",
]

MEDIUM_WORDS = [
    "problem",
    "issue",
    "delay",
    "broken",
    "complaint",
]


def predict_priority(text):
    text = (text or "").lower()

    for word in CRITICAL_WORDS:
        if word in text:
            return "Critical"

    for word in HIGH_WORDS:
        if word in text:
            return "High"

    for word in MEDIUM_WORDS:
        if word in text:
            return "Medium"

    return "Low"
