# HealthConnect India — Project Status

## 🏥 Project Overview
HealthConnect India is a comprehensive health records management platform built for the Indian healthcare ecosystem, with an accessibility-first approach for elderly and less-educated users. It integrates with India's ABHA (Ayushman Bharat Health Account) and ABDM (Ayushman Bharat Digital Mission) standards.

**Team / Project:** Neon Vector · IDT Lab Project

**Core Stack:**
- **Frontend**: React 19, Vite 7, TypeScript, TanStack Router v1, TanStack Query v5, Tailwind CSS v4, Shadcn/ui, Recharts
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, Multer
- **Auth**: JWT (Phone+Password and ABHA ID login)
- **Deployment**: Vercel (frontend) · Render (backend) · MongoDB Atlas

---

## 🌐 Local Dev URLs
| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001/api |
| Health Check | http://localhost:5001/health |

---

## 📊 Current Status

### Frontend — ✅ COMPLETE
All pages are implemented and integrated. The frontend has a **client-side demo/mock mode** (`mockApi.ts`) that kicks in automatically if the backend is unreachable (e.g. Vercel deployment without a running backend), allowing full end-to-end testing without a server.

| Page / Route | Status | Notes |
|---|---|---|
| Landing Page (`/`) | ✅ Done | Multi-language landing page with 7 Indian languages (EN, HI, KN, BN, TA, TE, ML), voice TTS button, personas, features sections |
| Login (`/login`) | ✅ Done | Supports Phone+Password and ABHA ID toggle |
| Register (`/register`) | ✅ Done | Standard registration flow |
| Dashboard (`/dashboard`) | ✅ Done | Overview, Records, and Appointments tabs; ABHA status card; QR share modal with Generate + Manage Links tabs |
| ABHA Link (`/abha-link`) | ✅ Done | Verify ABHA number → Link to account → Request consent → Fetch ABDM records |
| Upload Record (`/records/upload`) | ✅ Done | Full form: record type, doctor info, diagnosis, medicines list, lab tests list, file drag-&-drop (up to 5 attachments) |
| Book Appointment (`/appointments/book`) | ✅ Done | Doctor name, date, 12 time slots, consultation type (in-person / video / phone), reason |
| Profile (`/profile`) | ✅ Done | Edit name, phone, DOB, gender, address, preferred language |
| Public Share (`/share/:token`) | ✅ Done | Unauthenticated public timeline viewer for QR-shared records with full timeline cards |

### Backend — ✅ COMPLETE
Express REST API with JWT auth, rate limiting, Helmet security headers, NoSQL injection protection, gzip compression, and Socket.io real-time layer.

| Module | Status | Notes |
|---|---|---|
| Auth (`/api/auth`) | ✅ Done | register, login (phone), login-abha, getProfile, updateProfile |
| Health Records (`/api/records`) | ✅ Done | CRUD + multipart file upload via Multer |
| Appointments (`/api/appointments`) | ✅ Done | CRUD + cancel endpoint |
| ABHA / ABDM (`/api/abha`) | ✅ Done | verify, link, status, consent-request, consent-status, health-records; falls back to mock when credentials absent |
| Share Tokens (`/api/share`) | ✅ Done | generate, list-my-tokens, revoke, public-timeline (no auth) |

### Database Seeding — ✅ AUTO-SEEDED
- `database.js` reads `patients.seed.json` at startup and seeds the DB automatically if no doctor record is found.
- Falls back to `mongodb-memory-server` (in-memory DB) if remote MongoDB Atlas is unreachable — zero-config local setup.
- `create_demo.js` script available for manually seeding a single rich demo user (Rajesh Kumar) with 8 timeline entries and 4 appointments.

### Frontend Mock Mode — ✅ COMPLETE
`mockApi.ts` provides a full client-side fallback powered by `patients.seed.json`. Supports login, profile, records, appointments, ABHA status, QR share generate/list/revoke, and public timeline. Activated automatically on network failure or 5xx responses.

---

## 🧑‍⚕️ Demo Account Credentials

### Seed-file patients (auto-loaded from `patients.seed.json`)

| Name | Phone | ABHA ID | Password |
|---|---|---|---|
| Suresh Rao | `+91-9800000001` | `412356789012` | `Password123!` |
| Meena Sharma | `+91-9900000022` | `418733442211` | `Password123!` |
| Rahul Verma | `+91-9700000033` | `415599883300` | `Password123!` |

- **Suresh Rao** — Diabetes & Cardiology (NSTEMI hospitalization, angiogram, regular checkups)
- **Meena Sharma** — Orthopedics (bilateral total knee replacements, hypothyroidism management)
- **Rahul Verma** — Pulmonology (asthma exacerbation, spirometry, teleconsultations, vaccinations)

### `create_demo.js` script patient (single user)

| Name | Email | Phone | ABHA ID | Password |
|---|---|---|---|---|
| Rajesh Kumar | `demo@healthconnect.in` | `9999999999` | `91-7825-6034-9180` | `Password123!` |

---

## 🔑 Key Technical Notes

- **Language support**: 7 Indian languages on the landing page — English, Hindi (हिन्दी), Kannada (ಕನ್ನಡ), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Malayalam (മലയാളം). Language switcher in the navbar + footer.
- **Voice / TTS**: Landing page has a `VoiceButton` component using the Web Speech API to read page content aloud; auto-adjusts rate/pitch for Indian-language scripts.
- **QR Share**: Dashboard generates time-limited share links (1h / 6h / 24h / 72h). `Public Share` route renders a full patient timeline without requiring login. QR codes embed the app logo via `qrcode.react`.
- **ABHA mock whitelist**: `91782560349180` (Rajesh Kumar) and a few test IDs are in the ABDM service mock whitelist.
- **Rate limiting**: 200 requests/minute per IP globally.
- **File uploads**: Stored in `/backend/uploads/`, served as static files at `/uploads/*`.
- **Socket.io**: Real-time events for `appointment-update` and `record-update` are broadcast via `io.emit`.

---

## 📋 Remaining / Known Gaps

| Item | Priority | Notes |
|---|---|---|
| Doctor directory / search | Low | Currently users enter doctor name manually when booking |
| Push notifications | Low | Socket.io layer exists but frontend listeners not yet wired |
| Jest test suites | Low | `package.json` has jest/supertest in devDeps but test files not written |
| ABHA OTP flow | Future | Current ABHA link is direct number match; no OTP-based ABDM V3 auth yet |
| i18n in app shell | Future | Language switching only on landing page; dashboard/profile are English only |
