# HealthConnect India 🏥

A comprehensive health records management platform built with modern web technologies, designed for elderly and less educated users with accessibility-first approach.

**Repository:** https://github.com/anish-rik/HealthConnect-India

---

## 📋 Project Overview

HealthConnect India helps patients manage their health records, link ABHA IDs, schedule appointments, and maintain their complete medical history in one secure place.

### Key Features
- 🌍 **Multi-Language Support** (7 Indian languages: English, Hindi, Kannada, Bengali, Tamil, Telugu, Malayalam)
- 🎤 **Voice Reading** for accessibility
- 🔐 **ABHA/ABDM Integration** for India's health ID system
- 👥 **Health Records Management** (view, upload, share)
- 📅 **Appointment Scheduling** with doctors
- 🛡️ **Role-based Access Control** (Patient, Doctor, Admin)
- ♿ **Accessibility Features** (WCAG compliant)
- 🌓 **Dark/Light Mode**

---

## 🗂️ Project Structure

```
HealthConnect-India/
├── frontend/                    # React + Vite frontend application
│   ├── src/
│   │   ├── components/         # React components (UI, theme, auth)
│   │   ├── routes/             # Page components (home, dashboard, login, etc)
│   │   ├── lib/                # Utilities (API client, translations, helpers)
│   │   ├── hooks/              # Custom React hooks
│   │   └── styles.css          # Global styles with Tailwind CSS
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                     # Express.js backend API
│   ├── src/
│   │   ├── models/             # MongoDB schemas (User, HealthRecord, Appointment)
│   │   ├── routes/             # API routes (auth, records, appointments)
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth, error handling
│   │   ├── config/             # Database configuration
│   │   └── utils/              # Helper functions
│   ├── server.js               # Express server entry point
│   ├── package.json
│   ├── .env                    # Environment variables (CONFIGURE THIS)
│   └── README.md
│
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)

### 1. Clone Repository

```bash
git clone https://github.com/anish-rik/HealthConnect-India.git
cd HealthConnect-India
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthconnect-india

# Start backend server (runs on http://localhost:5000)
npm run dev
```

### 3. Setup Frontend

```bash
cd HealthConnect-India

# Install dependencies
npm install

# Start frontend development server (runs on http://localhost:5173)
npm run dev
```

### 4. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/health (health check)

---

## 🔧 Environment Configuration

### Backend `.env` File

```env
# Server
PORT=5000
NODE_ENV=development

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthconnect-india?retryWrites=true&w=majority
DB_NAME=healthconnect-india

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=7d

# ABHA/ABDM Integration
ABHA_CLIENT_ID=your-abha-client-id
ABHA_CLIENT_SECRET=your-abha-client-secret
ABDM_BASE_URL=https://api.abdm.gov.in/v1

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Logging
LOG_LEVEL=info
```

### Frontend `.env` File

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Dependency Overview

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **TanStack Router** - File-based routing
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Lucide Icons** - Icon library

### Backend
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **Socket.io** - Real-time updates
- **Helmet** - Security headers
- **Morgan** - Request logging

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Health Records
- `GET /api/records` - List user records
- `POST /api/records` - Upload new record
- `GET /api/records/:id` - Get specific record
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record
- `POST /api/records/:id/share` - Share record with doctor

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Schedule appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

---

## 🛡️ Accessibility Features

✅ WCAG 2.1 Level AA compliant
- Screen reader support
- Keyboard navigation
- High contrast support
- Voice reading in multiple languages
- Skip to main content link
- Proper ARIA labels
- Semantic HTML structure
- Focus indicators on all interactive elements

---

## 📱 Responsive Design

- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface
- Optimized for low-end devices

---

## 🚀 Deployment

### Frontend (Vercel - Recommended)
```bash
cd HealthConnect-India
npm run build
# Upload dist/ folder to Vercel
```

### Backend (Heroku/Railway/Render)
```bash
cd backend
npm run build
# Deploy to your preferred platform
```

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📝 Common Commands

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Verify MongoDB Atlas credentials in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure connection string is correct

### API Not Connecting
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify `VITE_API_URL` in frontend `.env`

### Accessibility Issues
- Test with screen readers (NVDA, JAWS)
- Use Lighthouse in Chrome DevTools
- Check color contrast ratios

---

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/anish-rik/HealthConnect-India/issues
- Email: reach.anishc@gmail.com

---

## 📄 License

MIT License - feel free to use this project for commercial or personal purposes.

---

## ✨ Contributors

- **Anish** - Lead Developer
- **Gourav** - Collaborator

---

**Last Updated:** May 14, 2026
**Status:** 🟢 Active Development
