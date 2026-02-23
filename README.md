***Content Compliance System***

A multi-tenant enterprise content governance platform that enables organizations to monitor restricted vocabulary in employee communications and enforce approval workflows.

The system allows companies to define policy-restricted words, automatically detect violations in messages, and manage approval requests through an administrative dashboard.

**📜Features**

🏢 Multi-Tenant Organization Support

Company-level data isolation

Independent restricted word lists

Secure tenant-based authorization

👩‍💼 Admin Capabilities

Manage restricted vocabulary (Add / Edit / Delete)

Invite employees to organization

Review approval requests

Approve or reject flagged messages

👨‍💻 Employee Capabilities

Real-time message compliance validation

Approval request submission

Policy violation feedback

🔐 Security

JWT authentication

Role-based access control

Tenant-scoped data queries


**🧩Architecture Overview**
Backend

Node.js + Express REST API

MongoDB document storage

JWT middleware security layer

Modular route architecture

Frontend

React SPA

Axios API abstraction

Role-based routing

`

**📁Project Structure**
content-compliance-system/

│

├── backend/

│   ├── middleware/        # Auth middleware

│   ├── models/            # MongoDB schemas

│   ├── routes/            # API endpoints

│   ├── server.js          # Express entry

│   └── .env               # Environment variables

│

├── frontend/

│   ├── public/

│   └── src/

│       ├── components/    # Reusable UI

│       ├── pages/         # Screens

│       ├── api.js         # Axios instance

│       ├── App.js

│       └── index.js

│

└── README.md

`

**⏩Prerequisites**

Node.js (v16+)

npm

MongoDB (local or cloud)

Git

**⚙️ Backend Setup**

1️ Navigate to backend
cd backend

2️ Install dependencies
npm install

3️ Configure environment
Create .env:
MONGO_URI=mongodb://127.0.0.1:27017/restricted_words_db
JWT_SECRET=your_secret_key
PORT=5000

4️ Start backend
node server.js

Backend runs at:
http://localhost:5000

**🎨 Frontend Setup**

1️ Navigate to frontend
cd frontend

2️ Install dependencies
npm install

3️ Start frontend
npm start

Frontend runs at:
http://localhost:3000


**🧪 Usage Flow**

👑 Admin
Register company
Login
Add restricted words
Review employee requests
Approve / reject content

👩‍💻 Employee
Login
Submit content
System detects restricted words
Send for approval
Track approval status

**🔧 Troubleshooting**
❌ 401 Unauthorized

Ensure JWT token exists in localStorage

Verify backend JWT_SECRET matches

❌ MongoDB connection error

Check MongoDB service running

Verify MONGO_URI

❌ CORS / API errors

Ensure backend running

Verify axios baseURL

❌ UI role mismatch

Clear localStorage

Re-login


**🔮Future Enhancements**

Email notification workflow

AI-powered semantic compliance detection

Analytics dashboard

Deployment automation

