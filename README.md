# 🎓 Student Fee Management System

A complete **Student Fee Management System** built with **Next.js (Frontend)**, **Node.js + Express (Backend)** and **MongoDB (Database)**.  
This project allows admins to manage students, track monthly fee payments, and generate printable monthly reports.

---

## 🚀 Features

- ✅ Student Management (Add / View / Delete)
- ✅ Monthly Fee Tracking
- ✅ Paid / Unpaid Status
- ✅ Search & Filter Students
- ✅ Monthly Fee Collection Report
- ✅ Printable Multi‑Page Report (No Scroll in Print)
- ✅ MongoDB Database Integration
- ✅ Fully Responsive Admin Panel

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- ShadCN UI
- Zustand (State Management)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Database
- MongoDB Atlas (Cloud)

## 📁 Project Structure

project-root/
│
├── frontend/ # Next.js Frontend
│ ├── app/
│ ├── components/
│ ├── lib/
│ └── package.json
│
├── backend/ # Node + Express Backend
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── config/
│ └── server.js
│
└── README.md


---

## ⚙️ Environment Variables

### Backend `.env`

PORT=5000
MONGO_URI=your_mongodb_connection_string


### Frontend `.env.local`

NEXT_PUBLIC_API_URL=http://localhost:5000


---

## ▶️ Run Project Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2️⃣ Backend Setup
cd backend
pnpm install
pnpm run dev
Backend will run on:

http://localhost:5000
3️⃣ Frontend Setup
cd frontend
pnpm install
pnpm run dev
Frontend will run on:

http://localhost:3000
🖨 Report Printing Logic
Screen View → Student table is scrollable

Print View → Full table auto splits into pages

Header repeats on every page

Signature always comes at the end

No scrollbar appears in print

🌍 Deployment (Live Hosting)
Frontend (Vercel)
Push frontend to GitHub

Go to https://vercel.com

Import GitHub repo

Set environment variables

Deploy 🎉

Backend (Render)
Push backend to GitHub

Go to https://render.com

Create Web Service

Add MONGO_URI

Start Command:

pnpm start
Database (MongoDB Atlas)
Create account on MongoDB Atlas

Create cluster

Create database user

Whitelist IP: 0.0.0.0/0

Copy connection string and use in backend .env

🔐 Change MongoDB Account (Google Account)
If you want database to be owned by another Google account:

Login to new Google account

Create new MongoDB Atlas project

Create new cluster

Update MONGO_URI in backend

Redeploy backend

👨‍💻 Contributors
Ritam Pal

Arpan Paul

📄 License
This project is for educational and school internal use.
