<div align="center">

# 🚀 Smart Recruitment System

### An AI-Powered End-to-End Hiring Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://smart-recruitment-system-phi.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-Render-46E3B7?style=for-the-badge&logo=render)](https://smart-recruitment-backend-e8yn.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/📁_Source_Code-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/Preethi-Kintali/smart-recruitment-system)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)

</div>

---

## 🌐 Deployment

| Service | URL | Platform |
|---------|-----|----------|
| **Frontend** | [https://smart-recruitment-system-phi.vercel.app](https://smart-recruitment-system-phi.vercel.app) | Vercel |
| **Backend API** | [https://smart-recruitment-backend-e8yn.onrender.com](https://smart-recruitment-backend-e8yn.onrender.com) | Render |

> ⚠️ **Note:** The backend runs on Render's free tier. The first request after inactivity may take ~30 seconds to wake up.

---

## 📖 About the Project

The **Smart Recruitment System** is a full-stack AI-driven hiring platform that automates the entire recruitment lifecycle — from job posting to offer letter generation. It leverages **Google's Gemini AI** for intelligent resume screening, AI-powered mock interviews, and automated candidate decision-making.

### 🎯 Key Highlights
- **AI Resume Screening** — Automatically parses and scores candidate resumes against job requirements
- **Automated Decision Gates** — AI decides who gets shortlisted, invited for interviews, or rejected
- **Live Voice AI Interviews** — Candidates take a browser-based voice interview with speech recognition
- **Automated Email Notifications** — Every stage sends a templated email to the candidate
- **Offer Letter Generation** — PDF offer letters are auto-generated and emailed on final selection
- **Real-time Dashboard** — Recruiters see live stats across the hiring pipeline

---

## ✨ Features

### 👤 Candidate Features
| Feature | Description |
|---------|-------------|
| 🔐 Auth | Secure JWT-based Signup/Login |
| 📋 Job Browse | Browse all open job listings |
| 📄 Apply with Resume | Upload resume (PDF/DOCX) + fill profile |
| 🤖 AI Screening | Resume auto-screened by Gemini AI |
| 🎙️ Voice Interview | Live AI voice interview (5 questions, speech-to-text) |
| 📧 Email Updates | Automated emails at every stage |
| 📊 My Applications | Track all application statuses in one place |

### 🧑‍💼 Recruiter Features
| Feature | Description |
|---------|-------------|
| 📝 Create Jobs | Post new job openings with full JD |
| 📂 Applicant List | View and manage all applications per job |
| 🤖 AI Screening | One-click AI screening of all applicants |
| 📊 Dashboard | Real-time stats (applications, interviews, offers) |
| ✅ Interview Gate | Schedule AI mock interviews for shortlisted candidates |
| 📋 Interview Reports | Review AI-generated interview performance reports |
| 📄 Offer Letter | Auto-generate and send PDF offer letters |
| ❌ Reject with Feedback | Send rejection emails with AI-generated feedback |

### 🛡️ Admin Features
| Feature | Description |
|---------|-------------|
| 👥 User Management | View and manage all users |
| 🏢 Recruiter Management | Approve/manage recruiter accounts |
| 📈 Platform Stats | System-wide analytics |

---

## 🏗️ Architecture

```
smart-recruitment-system/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── pages/              # All page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx / Signup.jsx
│   │   │   ├── CandidatePortal.jsx
│   │   │   ├── CandidateApply.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── MockInterview.jsx   # AI Voice Interview
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── ApplicantList.jsx
│   │   │   ├── ScheduleInterview.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── components/
│   │   │   └── PublicRoute.jsx    # Route guards
│   │   └── api.js                 # Axios instance
│   └── vercel.json                # Vercel SPA routing config
│
└── server/                     # Node.js + Express Backend
    ├── routes/
    │   ├── auth.js             # Login, Signup, JWT
    │   ├── jobs.js             # Job CRUD
    │   ├── applications.js     # Applications + AI screening
    │   ├── interviews.js       # Interview scheduling
    │   ├── decisions.js        # AI decisions (shortlist/reject/offer)
    │   ├── stats.js            # Dashboard analytics
    │   └── admin.js            # Admin routes
    ├── models/                 # Mongoose schemas
    │   ├── User.js
    │   ├── Job.js
    │   ├── Application.js
    │   ├── Interview.js
    │   ├── Candidate.js
    │   └── RecruiterProfile.js
    ├── services/
    │   ├── email.service.js    # Nodemailer email templates
    │   └── pdf.service.js      # PDFKit offer letter generation
    ├── middleware/             # JWT auth middleware
    ├── utils/                  # PDF generator, helpers
    └── index.js                # App entry point
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client |
| **Framer Motion** | Animations & transitions |
| **Lucide React** | Icon library |
| **Web Speech API** | Voice recognition in AI interviews |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Authentication |
| **Multer** | File uploads (resumes) |
| **pdf-parse** | Resume PDF text extraction |
| **PDFKit** | Offer letter PDF generation |
| **Nodemailer** | Automated email sending |
| **Google Gemini AI** | Resume screening & interview evaluation |

---

## 🔄 Recruitment Pipeline

```
Candidate Applies
       ↓
  Resume Parsed (pdf-parse)
       ↓
  AI Screening (Gemini AI) ──► Rejected ──► Rejection Email
       ↓ Shortlisted
  Shortlisted Email Sent
       ↓
  AI Voice Interview Scheduled
       ↓
  Candidate Completes Voice Interview
       ↓
  AI Evaluates Interview Report
       ↓ Passed
  In-Person Interview Scheduled ──► Email Sent
       ↓ Selected
  Offer Letter Generated (PDF) ──► Email with Attachment
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key
- Gmail account (for email notifications)

### 1. Clone the Repository
```bash
git clone https://github.com/Preethi-Kintali/smart-recruitment-system.git
cd smart-recruitment-system
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

The app will be running at **http://localhost:5173**

### 4. Default Admin Credentials
To access the admin dashboard, you can use the following default credentials (after seeding the database):
- **Email:** `admin@smartrecruit.com`
- **Password:** `adminpassword123`

To seed the admin user, run:
```bash
cd server
node seedAdmin.js
```

---

## 📧 Email Notifications Sent

| Trigger | Recipient | Content |
|---------|-----------|---------|
| Application submitted | Candidate | Confirmation email |
| AI shortlists candidate | Candidate | Shortlisted notification |
| Interview scheduled | Candidate | AI interview link |
| Interview completed | Recruiter | AI performance report |
| In-person interview | Candidate | Date, time & location |
| Rejected | Candidate | Rejection with AI feedback |
| Selected | Candidate | Offer letter PDF attached |

---

## 🌍 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password |
| `GEMINI_API_KEY` | Google Gemini AI API key |
| `FRONTEND_URL` | Frontend URL for CORS (production) |

### Frontend (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |

---

## 📸 Application Screenshots

### 🏠 Home Page
The landing page with key features overview and call-to-action.

### 🎙️ AI Voice Interview
Browser-based voice interview with live camera feed, speech-to-text, and progress tracking.

### 📊 Recruiter Dashboard
Real-time statistics showing total applications, shortlisted, interviews, and offers.

### 📂 Applicant Management
Full applicant list with AI screening controls and status management.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

