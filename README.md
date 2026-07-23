# HealthConnect India 🏥

> **Empowering citizens with secure, accessible health records management and seamless ABDM/ABHA integration.**

HealthConnect India is a health records management platform built specifically for the Indian healthcare ecosystem. It bridges the digital divide with an **accessibility-first interface** designed for elderly and less-educated users, while integrating India's **Ayushman Bharat Digital Mission (ABDM)** and **Ayushman Bharat Health Account (ABHA)** standards.

A project by **Neon Vector** — IDT Lab.

---

## 🌟 Key Features

- **🔐 Unified Authentication** — Login with Phone Number + Password or a 14-digit ABHA ID
- **🌐 ABDM V3 Integration** — Verify, link, and fetch official ABDM health records with a simulated sandbox client-credential model; consent requests (`PENDING`/`APPROVED`) and health document retrieval
- **🩺 Interactive Health Timeline** — Chronological stream of Prescriptions, Lab Reports, Visit Summaries, Discharge Summaries, and Diagnostic Reports
- **📤 QR Code Sharing** — Generate time-limited shareable links (1h / 6h / 24h / 72h) with embedded QR codes; public timeline view for scanning doctors
- **📂 Document Upload** — Drag-and-drop file attachments (PDF, JPG, PNG) on record upload with multipart form parsing via Multer
- **📅 Appointment Scheduler** — Book in-person, video, or phone consultations with a 30-minute time-slot picker
- **👴 Accessibility-First UI** — Voice TTS button (Web Speech API) on the landing page; legible font scales; high-contrast touch targets; 7-language support
- **🌍 Multi-language Landing Page** — English, Hindi, Kannada, Bengali, Tamil, Telugu, and Malayalam
- **🔔 Real-time Updates** — Socket.io layer for appointment and record change notifications
- **🛡️ Demo / Offline Mode** — Client-side mock API (`mockApi.ts`) powered by `patients.seed.json`; full app is testable even without a running backend

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 7, TypeScript, Tailwind CSS v4, `@tanstack/react-router` v1, `@tanstack/react-query` v5, Shadcn/ui, Lucide React, Recharts, `qrcode.react` |
| **Backend** | Node.js, Express.js, Socket.io, MongoDB (Mongoose), Multer, Helmet, Morgan, `express-rate-limit`, `express-mongo-sanitize`, `compression` |
| **Auth** | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`) |
| **Dev / Testing** | Jest, Supertest, Prettier, ESLint, Nodemon |
| **Infrastructure** | MongoDB Atlas, Vercel (Frontend), Render (Backend), `mongodb-memory-server` (local fallback) |

---

## 📁 Repository Structure

```
HealthConnect-India/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection + auto-seed logic
│   │   ├── controllers/
│   │   │   ├── authController.js    # register, login, loginAbha, getProfile, updateProfile
│   │   │   ├── appointmentsController.js
│   │   │   ├── recordsController.js
│   │   │   └── shareController.js   # QR token generate/list/revoke + public timeline
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication middleware
│   │   │   ├── errorHandler.js      # Global error + 404 handlers
│   │   │   ├── upload.js            # Multer config for file attachments
│   │   │   └── validators.js        # express-validator schemas
│   │   ├── models/
│   │   │   ├── User.js              # Mongoose schema (ABHA fields, language, role)
│   │   │   ├── HealthRecord.js      # Records with medicines, labTests, attachments
│   │   │   ├── Appointment.js       # Appointments with timeSlot, consultationType
│   │   │   └── ShareToken.js        # Time-limited share tokens with accessCount
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── recordsRoutes.js
│   │   │   ├── appointmentsRoutes.js
│   │   │   ├── abhaRoutes.js
│   │   │   └── shareRoutes.js
│   │   ├── services/
│   │   │   └── abdmService.js       # ABDM V3 client (real + mock fallback)
│   │   ├── utils/
│   │   │   └── helpers.js           # Response helpers, token generation
│   │   └── server.js                # Express + Socket.io entrypoint
│   ├── create_demo.js               # One-shot script: seed Rajesh Kumar demo data
│   ├── patients.seed.json           # (root-level) Seed file with 3 Indian patient profiles
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth-provider.tsx    # AuthContext: user, login, logout, updateProfile
│   │   │   ├── logo.tsx             # AppIcon / Logo components
│   │   │   ├── theme-provider.tsx   # Dark/light theme context
│   │   │   ├── theme-toggle.tsx     # Theme switcher button
│   │   │   ├── voice-button.tsx     # Web Speech API TTS button
│   │   │   └── ui/                  # Shadcn/ui component library
│   │   ├── hooks/
│   │   │   └── use-mobile.tsx       # Responsive breakpoint hook
│   │   ├── lib/
│   │   │   ├── apiClient.ts         # Fetch wrapper with mock fallback
│   │   │   ├── mockApi.ts           # Full client-side demo mode
│   │   │   ├── patients.seed.json   # Demo patient data (3 profiles)
│   │   │   ├── translations.ts      # 7-language string dictionaries
│   │   │   └── utils.ts             # cn() and other helpers
│   │   ├── routes/
│   │   │   ├── index.tsx            # Landing page (multi-language)
│   │   │   ├── login.tsx            # Phone / ABHA login
│   │   │   ├── register.tsx         # Registration
│   │   │   ├── dashboard.tsx        # Main app: overview / records / appointments
│   │   │   ├── abha-link.tsx        # ABHA verify → link → consent → fetch
│   │   │   ├── profile.tsx          # Edit profile
│   │   │   ├── share.$token.tsx     # Public QR timeline viewer
│   │   │   ├── records/
│   │   │   │   └── upload.tsx       # Upload health record with file attachment
│   │   │   └── appointments/
│   │   │       └── book.tsx         # Book appointment form
│   │   ├── router.tsx               # TanStack Router setup
│   │   ├── routeTree.gen.ts         # Auto-generated route tree
│   │   ├── main.tsx                 # React entry point
│   │   └── styles.css               # Tailwind CSS v4 global styles
│   ├── public/
│   │   └── images/                  # logo-dark, logo-light, icon-dark, icon-light
│   ├── index.html
│   └── package.json
│
├── patients.seed.json               # Root-level seed for 3 Indian patient profiles
├── render.yaml                      # Render.com backend deployment config
├── project_status.md                # Current project status
└── GEMINI.md                        # Development guidelines and conventions
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local, Atlas URI, or use the zero-config **in-memory fallback**)

### 1. Clone the Repo

```bash
git clone https://github.com/anish-rik/HealthConnect-India.git
cd HealthConnect-India
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI if you have Atlas; otherwise leave it and the in-memory fallback kicks in
npm run dev
```

The server starts on **http://localhost:5001**. On first run with an empty database, it automatically seeds demo patient profiles from `patients.seed.json`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
# .env.local already sets VITE_API_URL=http://localhost:5001/api
npm run dev
```

The app opens at **http://localhost:5173**.

> **No backend?** The frontend's mock mode activates automatically on network failure, so you can test the full UI even without a running backend.

---

## 🧑‍⚕️ Test Accounts

### From `patients.seed.json` (auto-seeded on startup)

| Patient | Phone | ABHA ID | Password | Profile |
|---|---|---|---|---|
| Suresh Rao | `+91-9800000001` | `412356789012` | `Password123!` | Diabetes & Cardiology |
| Meena Sharma | `+91-9900000022` | `418733442211` | `Password123!` | Orthopedics |
| Rahul Verma | `+91-9700000033` | `415599883300` | `Password123!` | Pulmonology |

### From `create_demo.js` (run manually)

```bash
cd backend
node create_demo.js
```

| Patient | Email | Phone | ABHA ID | Password |
|---|---|---|---|---|
| Rajesh Kumar | `demo@healthconnect.in` | `9999999999` | `91-7825-6034-9180` | `Password123!` |

---

## 📡 REST API Reference

All routes are prefixed with `/api`.

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | — | Register with name, email, phone, password |
| `POST` | `/login` | — | Login with phone + password |
| `POST` | `/login-abha` | — | Login with 14-digit ABHA ID + password |
| `GET` | `/profile` | JWT | Get current user profile |
| `PUT` | `/profile` | JWT | Update name, phone, DOB, gender, address, language |

### Health Records (`/api/records`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | List all records for authenticated user |
| `POST` | `/` | JWT | Create record; accepts `multipart/form-data` for file uploads |
| `GET` | `/:id` | JWT | Get single record |
| `PUT` | `/:id` | JWT | Update record |
| `DELETE` | `/:id` | JWT | Delete record |

### Appointments (`/api/appointments`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | List all appointments |
| `POST` | `/` | JWT | Book appointment (doctorId, date, timeSlot, consultationType, reason) |
| `GET` | `/:id` | JWT | Get appointment details |
| `PUT` | `/:id` | JWT | Update appointment |
| `POST` | `/:id/cancel` | JWT | Cancel with reason |

### ABHA / ABDM (`/api/abha`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/verify` | JWT | Verify a 14-digit ABHA number (mock fallback when no credentials) |
| `POST` | `/link` | JWT | Link verified ABHA number to user account |
| `GET` | `/status` | JWT | Get ABHA linkage and consent status |
| `POST` | `/consent-request` | JWT | Initiate ABDM consent request |
| `GET` | `/consent-status` | JWT | Check consent status (PENDING / APPROVED / etc.) |
| `GET` | `/health-records` | JWT | Fetch ABDM-linked records once consent is approved |

### Share / QR (`/api/share`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/generate` | JWT | Create a time-limited share token (expiryHours, optional recordId) |
| `GET` | `/my-tokens` | JWT | List active (unexpired) share tokens |
| `DELETE` | `/:tokenId` | JWT | Revoke a share token |
| `GET` | `/public/:token` | — | Public patient timeline (no auth required) |

---

## 🔧 Development Scripts

```bash
# Backend
cd backend
npm run dev       # Start with nodemon (hot reload)
npm start         # Production start
npm run lint      # ESLint
npm run format    # Prettier
npm test          # Jest (watch mode)

# Frontend
cd frontend
npm run dev       # Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
npm run format    # Prettier
```

---

## 🌐 Deployment

- **Frontend**: Vercel — configured via `.vercel/project.json` and `vercel.json` at the repo root. Set `VITE_API_URL` to your Render backend URL in Vercel environment variables.
- **Backend**: Render — configured via `render.yaml`. Set `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, and optionally `ABHA_CLIENT_ID` / `ABHA_CLIENT_SECRET` in Render env vars.

### Key Environment Variables

**Backend (`.env`)**

```env
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
FRONTEND_URL=https://your-vercel-app.vercel.app
ABHA_CLIENT_ID=          # Optional — enables real ABDM calls
ABHA_CLIENT_SECRET=      # Optional — falls back to mock mode if absent
ABDM_BASE_URL=https://dev.abdm.gov.in/api/hiecm/gateway/v3
ABDM_CM_ID=sbx
```

**Frontend (`.env.local`)**

```env
VITE_API_URL=http://localhost:5001/api
```

---

## ⚠️ Disclaimer

This is a **college IDT lab research project** by Neon Vector. HealthConnect India is not a registered medical service. It does not independently store clinical data. ABDM integration is implemented against the sandbox environment.
