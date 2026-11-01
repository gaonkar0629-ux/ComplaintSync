import os

import joblib

from classifier import classify_complaint
from priority import predict_priority as keyword_priority

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")


def _load_model(model_name):
    model_path = os.path.join(MODEL_DIR, model_name)
    if not os.path.exists(model_path):
        return None
    try:
        return joblib.load(model_path)
    except Exception:
        return None


category_model = _load_model("category_model.pkl")
priority_model = _load_model("priority_model.pkl")


def predict_category(text):
    if category_model is None:
        result = classify_complaint(text)
        return {"category": result["category"], "confidence": float(result.get("confidence", 0.5))}

    prediction = category_model.predict([text])[0]
    probabilities = category_model.predict_proba([text])[0]
    confidence = max(probabilities)
    return {"category": prediction, "confidence": round(float(confidence), 2)}


def predict_priority(text):
    if priority_model is None:
        value = keyword_priority(text)
        return {"priority": value, "confidence": 0.6}

    prediction = priority_model.predict([text])[0]
    probabilities = priority_model.predict_proba([text])[0]
    confidence = max(probabilities)
    return {"priority": prediction, "confidence": round(float(confidence), 2)}


def analyze_complaint(text):
    category = predict_category(text)
    priority = predict_priority(text)
    return {
        "category": category["category"],
        "category_confidence": category["confidence"],
        "priority": priority["priority"],
        "priority_confidence": priority["confidence"],
    }
