import os

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)


def load_dataset():
    data = pd.read_csv(DATASET_PATH)
    data = data.dropna(subset=["text", "category", "priority"])
    return data


def train_category_model(X_train, y_train):
    model = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                stop_words="english",
                ngram_range=(1, 2),
                sublinear_tf=True,
            ),
        ),
        ("classifier", LogisticRegression(max_iter=2000)),
    ])
    model.fit(X_train, y_train)
    return model


def train_priority_model(X_train, y_train):
    model = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                stop_words="english",
                ngram_range=(1, 2),
                sublinear_tf=True,
            ),
        ),
        ("classifier", LogisticRegression(max_iter=2000)),
    ])
    model.fit(X_train, y_train)
    return model


def main():
    data = load_dataset()
    print("Dataset loaded")
    print("Total records:", len(data))

    X = data["text"]
    y_category = data["category"]
    y_priority = data["priority"]

    X_train_cat, X_test_cat, y_train_cat, y_test_cat = train_test_split(
        X,
        y_category,
        test_size=0.20,
        random_state=42,
        stratify=y_category,
    )

    category_model = train_category_model(X_train_cat, y_train_cat)
    category_predictions = category_model.predict(X_test_cat)
    category_accuracy = accuracy_score(y_test_cat, category_predictions)

    print("\n==============================")
    print("CATEGORY MODEL")
    print("==============================")
    print("Accuracy:", round(category_accuracy * 100, 2), "%")
    print(classification_report(y_test_cat, category_predictions, zero_division=0))

    X_train_pri, X_test_pri, y_train_pri, y_test_pri = train_test_split(
        X,
        y_priority,
        test_size=0.20,
        random_state=42,
        stratify=y_priority,
    )

    priority_model = train_priority_model(X_train_pri, y_train_pri)
    priority_predictions = priority_model.predict(X_test_pri)
    priority_accuracy = accuracy_score(y_test_pri, priority_predictions)

    print("\n==============================")
    print("PRIORITY MODEL")
    print("==============================")
    print("Accuracy:", round(priority_accuracy * 100, 2), "%")
    print(classification_report(y_test_pri, priority_predictions, zero_division=0))

    category_model_path = os.path.join(MODEL_DIR, "category_model.pkl")
    priority_model_path = os.path.join(MODEL_DIR, "priority_model.pkl")

    joblib.dump(category_model, category_model_path)
    joblib.dump(priority_model, priority_model_path)

    print("\n==============================")
    print("TRAINING COMPLETED")
    print("==============================")
    print("Category model:", category_model_path)
    print("Priority model:", priority_model_path)


if __name__ == "__main__":
    main()
