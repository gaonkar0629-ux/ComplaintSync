POSITIVE_WORDS = [
    "good",
    "great",
    "excellent",
    "thank",
    "thanks",
    "happy",
    "satisfied",
]

NEGATIVE_WORDS = [
    "bad",
    "poor",
    "problem",
    "issue",
    "worst",
    "angry",
    "frustrated",
    "disappointed",
    "broken",
    "not working",
]

URGENT_WORDS = [
    "urgent",
    "emergency",
    "immediately",
    "danger",
    "dangerous",
    "critical",
]


def analyze_sentiment(text):
    text = (text or "").lower()

    positive_score = sum(1 for word in POSITIVE_WORDS if word in text)
    negative_score = sum(1 for word in NEGATIVE_WORDS if word in text)
    urgent_score = sum(1 for word in URGENT_WORDS if word in text)

    if urgent_score > 0:
        return "Emergency"
    if negative_score >= 2:
        return "Angry"
    if negative_score == 1:
        return "Frustrated"
    if positive_score > negative_score:
        return "Positive"
    return "Normal"
