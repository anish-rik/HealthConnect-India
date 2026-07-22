# HealthConnect India - Project Status

## 🏥 Project Details
HealthConnect India is a comprehensive health records management platform built specifically for the Indian healthcare ecosystem. It aims to provide seamless accessibility to health records for elderly and less-educated users by incorporating ABHA (Ayushman Bharat Health Account) and ABDM (Ayushman Bharat Digital Mission) integration.

**Core Stack:**
- **Frontend**: React 19, Vite, TypeScript, TanStack Router, Tailwind CSS v4, Shadcn/ui
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io
- **Key Features**: Secure Authentication, ABHA Integration, Timeline Medical History, Appointment Management

## 🌐 Localhost Links
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API Base**: `http://localhost:5001/api`
- **Backend Health Check**: [http://localhost:5001/health](http://localhost:5001/health)

## 📊 Current Status
- **Frontend**: **✅ RUNNING**
  - Fully integrated with backend logic.
  - Login page updated to support Phone Number and ABHA ID toggling.
  - Dashboard, Timeline, and Medical Records UI implemented and populated with live data.
- **Backend**: **✅ RUNNING**
  - Server operates with auto-reload (`nodemon`).
  - Contains an integrated `mongodb-memory-server` fallback for smooth local testing (if remote MongoDB Atlas fails).
  - Handles custom authentication endpoints (`/api/auth/login`, `/api/auth/login-abha`).
- **Demo Data**: **✅ SEEDED**
  - The in-memory database automatically seeds itself with users, complete health records (prescriptions, lab tests, visit summaries), and appointments to test the timeline.

## 🧑‍⚕️ Demo Account Login Credentials
You can log in to test the application using either the user's Phone Number or ABHA ID along with their password.

### 1. Male Demo Account (Rajesh Kumar)
- **Phone Number**: `9876543210`
- **ABHA ID**: `91782560349180`
- **Password**: `Password123!`
- *Highlights*: Check the timeline for Pre-hypertension checkups, lipid profile labs, and future cardiology appointments.

### 2. Female Demo Account (Priya Sharma)
- **Phone Number**: `9999999999`
- **ABHA ID**: `12345678901234`
- **Password**: `Password123!`
- *Highlights*: Check the timeline for Hypothyroidism prescriptions, ultrasound reports, and past video consultation appointments.
