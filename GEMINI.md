# HealthConnect India - Project Instructions

Foundational instructions for the HealthConnect India platform. This document serves as the primary context for Gemini CLI interactions.

## Project Overview

HealthConnect India is a comprehensive health records management platform specifically designed for the Indian healthcare ecosystem, with a focus on accessibility for elderly and less educated users.

### Architecture
- **Monorepo-style structure:** Root directory containing independent `frontend` and `backend` services.
- **Backend:** Node.js / Express.js REST API with MongoDB (Mongoose).
- **Frontend:** React 19 / Vite / TypeScript with TanStack Router and Tailwind CSS v4.
- **Integration:** ABHA (Ayushman Bharat Health Account) / ABDM (Ayushman Bharat Digital Mission) for health ID integration.

### Core Technologies
- **Backend:** `express`, `mongoose`, `jsonwebtoken`, `socket.io`, `multer`, `helmet`, `morgan`.
- **Frontend:** `react`, `vite`, `@tanstack/react-router`, `@tanstack/react-query`, `tailwindcss` (v4), `shadcn/ui`, `lucide-react`, `sonner`.
- **Infrastructure:** MongoDB Atlas, Vercel (Frontend), Render/Railway/Heroku (Backend).

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- ABHA Client Credentials (Optional for local development)

### Backend Setup
```bash
cd backend
npm install
# Copy .env.example to .env and configure MONGODB_URI
npm run dev
```
- **Port:** 5000 (default)
- **Health Check:** `http://localhost:5000/health`

### Frontend Setup
```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:5000/api
npm run dev
```
- **Port:** 5173 (default)

---

## Development Conventions

### General
- **Formatting:** Use Prettier for all files (`npm run format`).
- **Linting:** Use ESLint (`npm run lint`).
- **Commits:** Follow concise, descriptive commit messages.

### Backend (Express)
- **Structure:**
  - `src/models/`: Mongoose schemas.
  - `src/controllers/`: Business logic.
  - `src/routes/`: API route definitions.
  - `src/middleware/`: Auth, validation, and error handlers.
  - `src/services/`: External API integrations (e.g., ABDM).
- **Auth:** JWT-based. Protect routes using `auth` middleware.
- **Errors:** Use the global `errorHandler` middleware.

### Frontend (React/TS)
- **Routing:** TanStack Router (file-based). Routes are located in `src/routes/`.
- **State Management:** React Query for server state; Context API for local auth/theme state.
- **Styling:** Tailwind CSS v4. Prefer utility classes.
- **Components:** Shadcn/ui components in `src/components/ui/`.
- **API Client:** Use the central `apiClient` in `src/lib/apiClient.ts`.
- **Accessibility:** Maintain WCAG compliance. Prioritize ARIA labels and keyboard navigation.

---

## Key Files & Directories

- `/backend/src/server.js`: Entry point for the Express server.
- `/backend/src/config/database.js`: MongoDB connection logic.
- `/frontend/src/main.tsx`: Entry point for the React application.
- `/frontend/src/router.tsx`: TanStack Router configuration.
- `/frontend/src/lib/apiClient.ts`: Axios-like wrapper for backend API calls.
- `/README.md`: High-level project documentation.

---

## Testing & Validation

- **Backend:** Run tests using Jest: `npm test` in `/backend`.
- **Frontend:** Ensure type safety with `tsc` and linting with `eslint`.
- **Manual Verification:** Always verify API changes via the `/health` endpoint and frontend integration.

---

## Deployment

- **Frontend:** Deployed via Vercel (see `vercel.json`).
- **Backend:** Deployed via Render (see `render.yaml`).
