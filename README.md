# HealthConnect India 🏥

> **Empowering citizens with secure, accessible health records management and seamless ABDM/ABHA integration.**

HealthConnect India is a state-of-the-art health records management platform built specifically for the Indian healthcare ecosystem. It aims to bridge the digital divide by providing an **accessibility-first interface** designed for elderly and less-educated users, while integrating robust digital health standards through India's **Ayushman Bharat Digital Mission (ABDM)** and **Ayushman Bharat Health Account (ABHA)**.

---

## 🌟 Key Features

- **🔐 Unified Authentication**: Login securely using either standard credentials (Phone Number + Password) or a 14-digit **ABHA ID**.
- **🌐 Ayushman Bharat Integration (ABDM V3)**: Verify, link, and fetch official ABDM health records. Features a simulated sandbox client-credential model for verification, consent requests (`PENDING`/`APPROVED`), and health document retrieval.
- **🩺 Interactive Health Timeline**: A highly visual, chronological stream of medical history including Prescriptions, Diagnostic Reports, Outpatient Consultations, and Discharge Summaries.
- **📂 Document Management & Upload**: Securely upload and attach scan copies of prescriptions, lab reports, and other health records (with multipart-form parsing).
- **📅 Intelligent Appointment Scheduler**: Seamlessly book physical, video, or telephonic consultations with real-time slot selection and updates.
- **👴 Accessibility-First UI**: Features legible typography (using clean, modern font scales), high-contrast touch targets, and simplified navigation flows designed to alleviate anxiety for elderly users.
- **🔔 Real-time Updates (WebSockets)**: Features instant notifications for appointment booking status modifications and live health records synchronization via Socket.io.

---

## 🛠️ Technology Stack

| Layer              | Technologies Used                                                                                                                 |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | React 19, Vite, TypeScript, Tailwind CSS v4, `@tanstack/react-router`, `@tanstack/react-query`, Shadcn/ui, Lucide React, Recharts |
| **Backend**        | Node.js, Express.js, Socket.io, MongoDB (Mongoose), Multer, Helmet, Morgan, Express-rate-limit                                    |
| **Testing**        | Jest, Supertest (Backend validation), Prettier, ESLint                                                                            |
| **Infrastructure** | MongoDB Atlas, Vercel (Frontend), Render (Backend Service)                                                                        |

---

## 📁 Repository Structure

The project follows a monorepo-style structure containing both client-side and server-side components:

```text
HealthConnect-India/
├── backend/                   # Node.js + Express backend service
│   ├── src/
│   │   ├── config/            # DB and server configs
│   │   ├── controllers/       # Controller business logic
│   │   ├── middleware/        # JWT auth, validator schemas, and error handlers
│   │   ├── models/            # Mongoose schemas (User, HealthRecord, Appointment)
│   │   ├── routes/            # REST API endpoints (auth, records, appointments, abha)
│   │   ├── services/          # External integrations (ABDM/ABHA Service wrapper)
│   │   ├── utils/             # Express API response helpers
│   │   └── server.js          # API main entrypoint & Socket.io initialization
│   ├── create_demo.js         # Script to seed in-memory / remote database
│   └── package.json
│
├── frontend/                  # React 19 + TypeScript frontend application
│   ├── src/
│   │   ├── components/        # Shadcn/ui & custom React components
│   │   ├── hooks/             # Custom context hooks (Auth, theme, etc.)
│   │   ├── lib/               # API clients (Axios/fetch wrapper)
│   │   ├── routes/            # TanStack file-based router pages (Dashboard, Timeline, etc.)
│   │   ├── styles.css         # Tailwind CSS v4 entrypoint
│   │   ├── router.tsx         # TanStack Router configuration
│   │   └── main.tsx           # React entry point
│   ├── index.html
│   └── package.json
│
├── render.yaml                # Infrastructure configuration for Render backend deployment
└── GEMINI.md                  # Development guidelines and coding conventions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (Local installation, Atlas Cluster URI, or use the **automated in-memory DB fallback**)

---

### 📥 1. Clone & Set Up the Repository

```bash
git clone https://github.com/anish-rik/HealthConnect-India.git
cd HealthConnect-India
```

---

### ⚙️ 2. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

   _Modify the variables inside `.env` to point to your MongoDB instance or leave standard ports._

4. **Run Server in Development Mode (with Live Reload):**
   ```bash
   npm run dev
   ```
   _Note: If no connection is made to a remote MongoDB, the backend automatically boots a local `mongodb-memory-server` and seeds it with demo accounts. This makes local setup completely zero-config._

- **API Base URL**: `http://localhost:5000/api`
- **Health Check Endpoint**: `http://localhost:5000/health`

---

### 💻 3. Frontend Setup & Run

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the development API URL configuration in `.env`:
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```
4. **Run Application in Development Mode:**
   ```bash
   npm run dev
   ```

- **Local Web Server**: [http://localhost:5173](http://localhost:5173)

---

## 🧑‍⚕️ Test Accounts & Credentials

The database contains pre-configured test profiles allowing you to explore the dashboard, booking features, and medical timeline instantly:

### 1. Male Patient (Rajesh Kumar)

- **Phone Number**: `9876543210`
- **ABHA ID**: `91782560349180`
- **Password**: `Password123!`
- _Featured Timeline Items_: Pre-hypertension health checkups, lipid profile diagnostic report files, and future appointment schedules with cardiologists.

### 2. Female Patient (Priya Sharma)

- **Phone Number**: `9999999999`
- **ABHA ID**: `12345678901234`
- **Password**: `Password123!`
- _Featured Timeline Items_: Hypothyroidism consultation prescriptions, ultrasound scan reports, and past virtual/video consultancy history.

---

## 📡 REST API Reference

The backend exposes the following routing modules under `/api`:

### 🔐 Authentication (`/api/auth`)

- `POST /register` - Register a new user with standard credentials and optional ABHA information.
- `POST /login` - Sign in using Phone Number & Password.
- `POST /login-abha` - Sign in using ABDM ABHA ID & Password.
- `GET /profile` - Retrieve current user information (Requires JWT).
- `PUT /profile` - Update profile particulars (Requires JWT).

### 🩺 Health Records (`/api/records`)

- `GET /` - Retrieve all records linked to user's profile.
- `POST /` - Create a new health record (Accepts `multipart/form-data` for file uploads).
- `GET /:id` - Retrieve individual health record details.
- `PUT /:id` - Update existing health record.
- `DELETE /:id` - Delete record entry.
- `POST /:id/share` - Securely share a health record with another doctor/user.

### 📅 Appointments (`/api/appointments`)

- `GET /` - List all appointments (past & upcoming) for the authenticated user.
- `POST /` - Request a new appointment (Physical, Video, or Telephonic).
- `GET /:id` - Retrieve individual appointment details.
- `PUT /:id` - Reschedule or update appointment parameters.
- `POST /:id/cancel` - Cancel appointment with a reason field.

### 🌐 ABHA Integration & Management (`/api/abha`)

- `POST /verify` - Verify an ABHA ID in the ABDM database (Mock fallback supported).
- `POST /link` - Link a verified 14-digit ABHA number to the current logged-in profile.
- `GET /status` - Retrieve current ABDM consent and linkage status.
- `POST /consent-request` - Initialize a consent request with ABDM/HIECM.
- `GET /consent-status` - Track permission status (`PENDING`, `APPROVED`, etc.).
- `GET /health-records` - Query and download ABDM linked records once consent is granted.

---

## 🧪 Testing, Linting & Formatting

Keep the codebase clean, readable, and verified with built-in scripts:

```bash
# Run backend test suites (using Jest & Supertest)
cd backend
npm test

# Check code files for syntax/linting rules
npm run lint

# Automatically format code styling (using Prettier)
npm run format
```

---

## 🌐 Production Deployments

This repository is optimized for quick hosting setups:

- **Frontend**: Set up for Vercel deployment with routing configuration inside [vercel.json](file:///Users/gouravyadav/Downloads/HealthConnect-India/frontend/vercel.json).
- **Backend**: Managed through the infrastructure blueprint [render.yaml](file:///Users/gouravyadav/Downloads/HealthConnect-India/render.yaml) for fast deployment on Render.
