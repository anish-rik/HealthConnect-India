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
  - Automatically seeds users, complete health records (prescriptions, lab tests, visit summaries), and appointments on any empty database (both remote MongoDB Atlas and local in-memory fallback).

## 🧑‍⚕️ Demo Account Login Credentials
You can log in to test the application using either the user's Phone Number or ABHA ID along with their password.

### 1. Suresh Rao
- **Phone Number**: `+91-9800000001`
- **ABHA ID**: `412356789012`
- **Password**: `Password123!`
- *Highlights*: Diabetes and Cardiology. Timeline includes NSTEMI hospitalization, angiogram, and regular checkups.

### 2. Meena Sharma
- **Phone Number**: `+91-9900000022`
- **ABHA ID**: `418733442211`
- **Password**: `Password123!`
- *Highlights*: Orthopedics. Timeline includes bilateral total knee replacements and hypothyroidism management.

### 3. Rahul Verma
- **Phone Number**: `+91-9700000033`
- **ABHA ID**: `415599883300`
- **Password**: `Password123!`
- *Highlights*: Pulmonology. Timeline includes asthma exacerbation, spirometry, teleconsultations, and vaccinations.
