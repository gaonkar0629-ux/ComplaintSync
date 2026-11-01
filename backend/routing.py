DEPARTMENT_MAP = {
    "Hostel": "Hostel Department",
    "Library": "Library Department",
    "Fees": "Accounts Department",
    "Exam": "Examination Department",
    "Transport": "Transport Department",
    "Canteen": "Canteen Department",
    "Wi-Fi": "IT Department",
    "Classroom": "Infrastructure Department",
    "General": "Administration Department",
}


def get_department(category):
    return DEPARTMENT_MAP.get(category, "Administration Department")
