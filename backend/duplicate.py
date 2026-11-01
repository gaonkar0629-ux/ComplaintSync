from difflib import SequenceMatcher


def calculate_similarity(text1, text2):
    text1 = (text1 or "").lower().strip()
    text2 = (text2 or "").lower().strip()
    return SequenceMatcher(None, text1, text2).ratio()


def find_duplicate(new_text, existing_complaints):
    best_match = None
    best_score = 0.0

    for complaint in existing_complaints:
        old_text = (complaint.get("title", "") + " " + complaint.get("description", ""))
        score = calculate_similarity(new_text, old_text)

        if score > best_score:
            best_score = score
            best_match = complaint

    if best_score >= 0.75:
        return {
            "is_duplicate": True,
            "similarity": round(best_score, 2),
            "complaint_id": str(best_match["_id"]) if best_match else None,
        }

    return {
        "is_duplicate": False,
        "similarity": round(best_score, 2),
        "complaint_id": None,
    }
