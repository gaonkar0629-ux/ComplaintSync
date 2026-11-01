# ComplaintSync – AI-Powered College Grievance Management System

**ComplaintSync** is a web-based college grievance management system designed to help students submit complaints, track their status, and improve communication between students and college administration.

## 🚀 Project Overview

Traditional complaint systems can be slow and difficult to track. ComplaintSync aims to make grievance management more organized through a centralized platform with AI-assisted complaint analysis.

## ✨ Key Features

- 📝 Submit and manage college complaints
- 📊 Student dashboard and complaint history
- 🧠 AI-assisted complaint classification and priority analysis
- 🔍 Duplicate complaint detection
- 😊 Sentiment analysis and urgency assessment
- 🏢 Department-based complaint routing
- 🤖 AI assistant interface
- 📱 Web-based frontend
- 🔐 Authentication and session-management components

*Feature availability depends on the current implementation and configuration.*

## 🏫 Complaint Categories

The system can be configured for college-related issues such as:

- Hostel
- Library
- Fees
- Examinations
- Transport
- Canteen
- Wi-Fi and Internet
- Classrooms

## 🛠️ Technology Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Python
- Flask

**Database**
- MongoDB (if configured in the current environment)

**AI / Analysis**
- Python-based classification, sentiment, priority, and duplicate-detection modules

## 📁 Project Structure

```text
ComplaintSync/
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── classifier.py
│   ├── duplicate.py
│   ├── predictor.py
│   ├── priority.py
│   ├── routing.py
│   ├── sentiment.py
│   ├── train.py
│   ├── requirements.txt
│   └── dataset.csv
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── complaint.html
│   ├── admin.html
│   ├── css/
│   └── js/
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/gaonkar0629-ux/ComplaintSync.git
cd ComplaintSync
```

### 2. Create a Python virtual environment

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Configure environment variables

Create a local `.env` file if required by your application. Add the configuration values needed by your backend, such as the MongoDB connection URI and session secret.

**Never commit passwords, API keys, or your `.env` file to GitHub.**

### 5. Start the application

If `backend/app.py` is the configured Flask entry point, run:

```bash
python backend/app.py
```

Open the local URL printed by Flask in your browser. A common local development address is `http://127.0.0.1:5000`, if configured by the application.

## 🔒 Security Notes

- Keep credentials and secret keys outside source control.
- Use environment variables for sensitive configuration.
- Do not upload real student complaints or personal information.
- Configure authentication, authorization, and secure session settings before deployment.

## 🎯 Project Objectives

- Simplify the college complaint submission process.
- Improve complaint tracking and transparency.
- Assist in identifying complaint categories and urgency.
- Help administrators organize and prioritize grievances.
- Support more efficient communication between students and administration.

## 🔮 Future Enhancements

- Multilingual support for English, Marathi, and Hindi
- Voice and image-based complaint submission
- Complaint-resolution time estimation
- Analytics dashboard and reports
- Email or notification integration
- Production deployment with stronger security

## 👨‍💻 Repository

GitHub: https://github.com/gaonkar0629-ux/ComplaintSync

## 📌 Disclaimer

This project is intended for educational and demonstration purposes. AI-assisted classifications and priority estimates should be reviewed by authorized college staff.

---

**ComplaintSync — Your Complaint. Our Responsibility.**
