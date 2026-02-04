# 🚀 Project Setup & Running Guide

This project uses a **MERN stack** with separate **backend (server)** and **frontend (client)** applications.

---

## 📦 Prerequisites

Ensure the following are installed on your system:

- Node.js (v16 or higher)
- npm
- MongoDB Atlas or local MongoDB

---

## ⚙️ Environment Variables (Backend)

Create a `.env` file inside the `server` directory and add:

```env
MONGODB_URL=
JWT=adityakale
ADMIN_SECRET=adminsecret


🔧 Backend Installation & Running Procedure
cd server
npm install
npm start


Backend will run on the configured port (example: http://localhost:8080)

Ensure MongoDB connection is successful

🎨 Frontend Installation & Running Procedure
cd client
npm install
npm start


Frontend will run on http://localhost:3000

Make sure backend is running before starting frontend
