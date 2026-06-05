# ⚡ ZenTask — Modern MERN Task Management Platform

**ZenTask** is a premium, high-performance task management system built using the **MERN (MongoDB, Express, React, Node.js)** stack. This project has been developed as an **Internship Technical Assignment**, demonstrating production-grade software architecture, secure authentication patterns, strict form validation, and responsive user experiences.

---

## 🚀 Key Assignment Highlights

This application is built with a focus on clean code, secure state handling, and robust user workflows:

*   **🔒 Secure Dual-Token Auth (JWT)**: Implements standard security patterns with short-lived `AccessToken` and persistent `RefreshToken` served via secure, client-hidden `HttpOnly` cookies to protect against XSS/CSRF attacks.
*   **🔄 Automatic Token Refresh (Axios Interceptors)**: Uses an automated response interceptor. If a request fails with a `401 Unauthorized` due to access token expiry, the client automatically makes a background call to rotate tokens and retries the original request seamlessly.
*   **🛠️ Robust Input Validation (Formik + Yup)**: All entry forms (Login, Registration, Settings, Task Modals) are bound with **Formik** and validated through strict **Yup schemas** with immediate user validation alerts.
*   **📋 Smart Pagination & Filtering**: Integrated with text search (title/description), status filtering (All, Pending, Completed), and pagination (5 per page). Features boundary correction (resets page state if a task deletion or search leaves the current page out of bounds).
*   **🌓 Persistent Workspace Customization**: Settings preferences (Theme preferences and Email/Push notifications toggles) are locally cached in `localStorage` to preserve layout states across browser refreshes.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19, React Router v7, Tailwind CSS v4, Axios, Lucide React, Formik, Yup
*   **Backend**: Node.js, Express.js (ES Modules syntax), JSON Web Tokens (JWT), Bcrypt (password hashing)
*   **Database**: MongoDB (via Mongoose ODM)

---

## 📂 Project Architecture

```text
Task Management/
├── Backend/                 # Express API Engine
│   ├── src/
│   │   ├── config/          # MongoDB configuration
│   │   ├── controller/      # API Controllers (User & Task logic)
│   │   ├── middleware/      # JWT Verification middleware
│   │   ├── model/           # Mongoose Database schemas
│   │   ├── routes/          # Express Routers
│   │   ├── utils/           # Centralized API response/error handlers
│   │   ├── app.js           # Middleware setup & route mounting
│   │   └── server.js        # Main Entry Point
│   └── package.json
└── Frontend/                # React SPA Application
    ├── src/
    │   ├── axios/           # Axios instance & interceptors config
    │   ├── components/      # UI components (TaskCard, Sidebar, Navbar)
    │   ├── context/         # AuthContext & AppContext (State)
    │   ├── layouts/         # App layouts (AppLayout, AuthLayout)
    │   ├── pages/           # Pages (Dashboard, Settings, Profile, Login)
    │   └── routes/          # React Router v7 configurations
    └── package.json
```

---

## 🗄️ Database Schemas

### 👥 User Schema
*   `name`: `String` (Required, Trimmed)
*   `email`: `String` (Required, Unique, Trimmed)
*   `password`: `String` (Required, Bcrypt hashed)
*   `refreshToken`: `String` (Optional, JWT)

### 📝 Task Schema
*   `title`: `String` (Required, Trimmed)
*   `description`: `String` (Optional, Trimmed)
*   `status`: `String` (Enum: `['pending', 'completed']`, Default: `'pending'`)
*   `userId`: `ObjectId` (Ref: `User`, Indexed)

---

## ⚙️ Getting Started & Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **MongoDB** (Local or Atlas) installed.

### 2. Environment Configurations

#### Backend Environment
Create a `.env` file in the `Backend/` directory:
```env
PORT=4000
MONGODB_URL=your_mongodb_connection_uri
CORS=http://localhost:5173
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_jwt_access_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
REFRESH_TOKEN_EXPIRY=4d
```

#### Frontend Environment
Create a `.env` file in the `Frontend/` directory:
```env
VITE_API_URL=http://localhost:4000
```

### 3. Installation & Run commands

#### Start Backend server:
```bash
cd Backend
npm install
npm run dev
```

#### Start Frontend React Client:
```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser to run the application.
