# HealthConnect India — Development Guide

Primary reference for AI-assisted development on this project.

## Project Overview

HealthConnect India is a health records management platform for the Indian healthcare ecosystem, focusing on accessibility for elderly and less-educated users. It integrates with India's ABHA (Ayushman Bharat Health Account) / ABDM (Ayushman Bharat Digital Mission) standards.

**Team:** Neon Vector — IDT Lab Project

### Architecture

```
Monorepo
├── backend/     Node.js + Express REST API
└── frontend/    React 19 + Vite + TypeScript SPA
```

The frontend has a full **client-side mock mode** (`src/lib/mockApi.ts`) that uses `patients.seed.json` as its data source. The API client (`apiClient.ts`) falls back to mock mode automatically on network failure or 5xx errors.

---

## Tech Stack (exact versions from package.json)

**Backend dependencies (key)**
- `express` ^4.18.2
- `mongoose` ^7.0.0
- `socket.io` ^4.5.0
- `multer` ^2.1.1
- `jsonwebtoken` ^9.0.0
- `bcryptjs` ^2.4.3
- `express-rate-limit` ^8.5.2
- `express-mongo-sanitize` ^2.2.0
- `helmet` ^7.0.0
- `compression` ^1.7.4
- `mongodb-memory-server` ^11.2.0

**Frontend dependencies (key)**
- `react` ^19.2.0
- `vite` ^7.3.1
- `@tanstack/react-router` ^1.168.25
- `@tanstack/react-query` ^5.83.0
- `tailwindcss` ^4.2.1
- `@tailwindcss/vite` ^4.2.1 (Tailwind v4 uses the Vite plugin, not PostCSS)
- `shadcn/ui` components via `@radix-ui/*`
- `lucide-react` ^0.575.0
- `recharts` ^2.15.4
- `qrcode.react` ^4.2.0
- `sonner` ^2.0.7 (toast notifications)
- `zod` ^3.24.2
- `react-hook-form` ^7.71.2

---

## Running Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env   # then configure MONGODB_URI (or leave blank for in-memory fallback)
npm run dev            # nodemon on port 5001
```

Auto-seeds from `patients.seed.json` if DB is empty. Falls back to `mongodb-memory-server` if Atlas is unreachable.

### Frontend
```bash
cd frontend
npm install
npm run dev            # Vite on port 5173
```

`VITE_API_URL` defaults to `http://localhost:5001/api` via `.env.local`. Mock mode activates automatically if the backend is down.

---

## Directory Structure

### Backend `src/`

```
config/
  database.js           MongoDB connect + auto-seed (reads patients.seed.json at root)
controllers/
  authController.js     register, login, loginAbha, getProfile, updateProfile
  appointmentsController.js
  recordsController.js
  shareController.js    generateShareToken, listMyTokens, revokeShareToken, getPublicTimeline
middleware/
  auth.js               authenticateToken (JWT)
  errorHandler.js       notFoundHandler, errorHandler
  upload.js             Multer config (dest: uploads/, 5MB limit)
  validators.js         express-validator chains
models/
  User.js               name, email, phone, password(hashed), abhaId, abhaConsentStatus, gender, language, role
  HealthRecord.js       userId, recordType, title, description, doctor{}, date, diagnosis, medicines[], labTests[], attachments[]
  Appointment.js        userId, doctorId, appointmentDate, timeSlot{startTime,endTime}, reason, status, consultationType
  ShareToken.js         userId, token(UUID), expiresAt, isActive, accessCount, label, recordId(optional)
routes/
  authRoutes.js
  recordsRoutes.js
  appointmentsRoutes.js
  abhaRoutes.js
  shareRoutes.js
services/
  abdmService.js        ABDMService class: getAccessToken, verifyABHA, createConsentRequest, getConsentStatus, fetchHealthRecords + mock fallbacks
utils/
  helpers.js            generateToken, sendSuccessResponse, sendErrorResponse, validateEmail, validatePhoneNumber
server.js               Express setup, Socket.io init, all route mounts, /health endpoint
```

### Frontend `src/`

```
components/
  auth-provider.tsx     AuthContext: user, login, logout, updateProfile, isAuthenticated, isLoading
  logo.tsx              <AppIcon> and <Logo> components
  theme-provider.tsx    ThemeContext (dark/light/system)
  theme-toggle.tsx      Toggle button
  voice-button.tsx      Web Speech API TTS; rate/pitch adjusted for Indian languages
  ui/                   Shadcn/ui components (accordion, alert, button, card, dialog, input, etc.)
hooks/
  use-mobile.tsx        useIsMobile() — breakpoint hook
lib/
  apiClient.ts          ApiClient class wrapping fetch; auth endpoints, records, appointments, abha, share; falls back to mockApi on error
  mockApi.ts            handleMockRequest() — full client-side demo mode from patients.seed.json
  patients.seed.json    3 demo patients: Suresh Rao (P001), Meena Sharma (P002), Rahul Verma (P003)
  translations.ts       LangCode type + translations Record<LangCode, Dict> for EN, HI, KN, BN, TA, TE, ML
  utils.ts              cn() (clsx + tailwind-merge)
routes/
  __root.tsx            Root layout with ThemeProvider, AuthProvider, Toaster
  index.tsx             Landing page — multi-language, VoiceButton, personas, features, trust section
  login.tsx             Phone/ABHA toggle login
  register.tsx          Registration form
  dashboard.tsx         3 tabs: Overview | Records | Appointments + QR share modal
  abha-link.tsx         ABHA verify → link → request consent → fetch records
  profile.tsx           Edit personal info + language preference
  share.$token.tsx      Public timeline viewer (unauthenticated)
  records/
    upload.tsx          Upload form: type, title, doctor, diagnosis, medicines[], labTests[], file drag-drop
  appointments/
    book.tsx            Book form: doctor name, date, 12 time slots, consultation type, reason
router.tsx              TanStack Router with QueryClient context
routeTree.gen.ts        Auto-generated (do not edit manually)
main.tsx                React entry point
styles.css              Tailwind CSS v4 global styles + design tokens
```

---

## Development Conventions

### General
- **Formatter:** Prettier (config in `.prettierrc` / `.prettierignore`)
- **Linter:** ESLint (`eslint.config.js` in frontend, `eslint` in backend)
- **Commits:** Concise, descriptive commit messages

### Backend (Express/JS)
- Use `sendSuccessResponse` / `sendErrorResponse` from `utils/helpers.js` — never `res.json()` directly
- Protect routes with `authenticateToken` middleware
- Use `errorHandler` middleware — avoid unhandled promise rejections
- File uploads go through `upload.js` (Multer); stored in `/backend/uploads/`
- ABDM calls always go through `abdmService.js` — never call ABDM directly from controllers

### Frontend (React/TS)
- **Routing:** TanStack Router (file-based). New routes = new file in `src/routes/`. Run `npm run dev` to regenerate `routeTree.gen.ts`.
- **Server state:** TanStack Query (`useQuery`, `useMutation`). Auth state lives in `AuthContext`.
- **Styling:** Tailwind CSS v4 utility classes. Use `cn()` from `lib/utils.ts` for conditional classes.
- **Components:** Prefer Shadcn/ui components from `src/components/ui/`. Avoid creating custom components for things already in Shadcn.
- **API calls:** Always use `apiClient` from `lib/apiClient.ts`. Never call `fetch` directly in components.
- **Types:** Keep TypeScript strict. No `any` unless absolutely required and commented.
- **Accessibility:** ARIA labels on all interactive elements. Keyboard navigation support. Use semantic HTML.
- **Toast:** Use `sonner` toast for user feedback (success/error messages).
- **Icons:** Lucide React only. Check `lucide-react` docs before creating custom SVGs.

### Adding a New API Endpoint
1. Add the Mongoose model if needed in `src/models/`
2. Write the controller function in `src/controllers/`
3. Add the route in `src/routes/`
4. Mount the router in `server.js`
5. Add the client method in `frontend/src/lib/apiClient.ts`
6. Add a mock handler in `frontend/src/lib/mockApi.ts` so demo mode keeps working

### Adding a New Frontend Page
1. Create `src/routes/your-page.tsx` with `createFileRoute('/your-page')({ component: YourPage })`
2. Run `npm run dev` — TanStack Router will auto-update `routeTree.gen.ts`
3. Add the auth guard pattern (`useEffect` + redirect to `/login`) if the page requires auth

---

## Key Files Quick Reference

| File | Purpose |
|---|---|
| `backend/src/server.js` | Express + Socket.io bootstrap |
| `backend/src/config/database.js` | MongoDB connect + auto-seed logic |
| `backend/src/services/abdmService.js` | All ABDM API calls (real + mock) |
| `backend/create_demo.js` | One-shot demo data seeder (Rajesh Kumar) |
| `patients.seed.json` | 3 demo patient profiles (Suresh, Meena, Rahul) |
| `frontend/src/lib/apiClient.ts` | All backend API calls + mock fallback trigger |
| `frontend/src/lib/mockApi.ts` | Full offline/demo mode implementation |
| `frontend/src/lib/translations.ts` | 7-language string dictionaries |
| `frontend/src/components/auth-provider.tsx` | Auth state + helpers |
| `frontend/src/router.tsx` | TanStack Router configuration |

---

## Environment Variables

### Backend (`.env`)
```env
PORT=5001
MONGODB_URI=mongodb+srv://...      # Leave blank to use in-memory fallback
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
ABHA_CLIENT_ID=                    # Optional — real ABDM sandbox
ABHA_CLIENT_SECRET=                # Optional — falls back to mock if absent
ABDM_BASE_URL=https://dev.abdm.gov.in/api/hiecm/gateway/v3
ABDM_CM_ID=sbx
ABDM_USE_MOCK=true                 # Force mock mode even if credentials present
```

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## Health Check

```
GET http://localhost:5001/health
```
Returns DB connection state and ABDM config status (`configured` or `mock-mode`).

---

## Deployment

- **Frontend → Vercel**: Set `VITE_API_URL` env var to backend URL. Routes handled by `vercel.json`.
- **Backend → Render**: Uses `render.yaml`. Set all backend env vars in Render dashboard.

---

## ABDM Mock Whitelist

The following ABHA IDs are in the mock service whitelist (`abdmService.js`) and will return `exists: true` without real ABDM credentials:

- `12345678901234`
- `98765432109876`
- `11111111111111`
- `91782560349180` (Rajesh Kumar demo account)

Patient ABHA IDs in `patients.seed.json` (Suresh / Meena / Rahul) use different numbers. If you need those to pass ABHA verification in mock mode, add them to the `mockValidABHA` array in `abdmService.js`.
