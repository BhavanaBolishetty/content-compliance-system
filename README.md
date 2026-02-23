# 🚀 Content Compliance System

PROBLEM: Organizations struggle to control policy violations in internal communication systems.

This platform provides automated restricted word detection with an approval workflow to ensure compliant communication across teams. 

---

## ✨ Features

### 🏢 Company Admin
- Company registration & authentication
- Restricted word management (Add / Edit / Delete)
- Approval workflow dashboard
- Invite employees
- Company profile view
- Real-time approval refresh

### 👨‍💻 Employee
- Employee login
- Message submission
- Automatic restricted word detection
- Approval request creation

### 🔐 System
- JWT authentication
- Multi-company isolation
- Role-based access
- Secure API architecture

---

## 🧱 Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Lucide Icons
- Custom CSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

## 📁 Project Structure
```

content-compliance-system/
│
├── backend/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ └── .env
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── App.js
│ │ ├── api.js
│ │ └── index.js
│
└── README.md

```
---
## ⚙️ Installation

**⚙️ Backend Setup**

1️. Navigate to backend
```
cd backend
```
2️. Install dependencies
```
npm install
```
3️. Create .env:
```
MONGO_URI=mongodb://127.0.0.1:27017/restricted_words_db

JWT_SECRET=your_secret_key

PORT=5000
```
4️. Start backend
```
node server.js
```
Backend runs at:
http://localhost:5000


**🎨 Frontend Setup**

1️. Navigate to frontend
```
cd frontend
```
2️. Install dependencies
```
npm install
```
3️. Start frontend
```
npm start
```
Frontend runs at:
http://localhost:3000

---

## 🔑 Usage Flow

Register company

Admin logs in

Add restricted words

Invite employees

Employees send messages

System detects violations

Admin approves/rejects requests

---

## 🎯 Future Enhancements

Compliance analytics dashboard with violation insights

Email and in-app notification system

Secure password reset and account recovery

Browser extension for real-time restricted word detection




