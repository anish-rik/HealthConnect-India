# HealthConnect India - Backend Setup Instructions

## Project Overview
Node.js/Express backend API with MongoDB for health records management, ABHA integration, JWT authentication, appointment scheduling, and WebSocket notifications.

## Setup Checklist

- [x] Project requirements clarified (Node.js/Express, MongoDB, ABHA, JWT, Appointments, Real-time)
- [x] Project structure scaffolded
- [x] Core models created (User, HealthRecord, Appointment)
- [x] Authentication system implemented (JWT, bcrypt)
- [x] Middleware setup (Auth, Error handling)
- [x] API routes initialized (Auth endpoints)
- [x] Dependencies installed
- [x] Development server running
- [ ] MongoDB connected and verified
- [ ] Additional routes implemented (Health Records, Appointments, ABHA)
- [ ] Testing and documentation completed

## Technology Stack
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Real-time**: Socket.io for WebSocket
- **Validation**: Express-validator
- **ABHA Integration**: ABDM API client (to be implemented)

## Completed Features
1. ✅ User registration & login with JWT
2. ✅ Password hashing with bcryptjs
3. ✅ User profile management
4. ✅ JWT authentication middleware
5. ✅ Role-based access control setup
6. ✅ Error handling middleware
7. ✅ CORS and security headers (Helmet)
8. ✅ WebSocket infrastructure
9. ✅ Environment configuration
10. ✅ Database connection (with fallback for dev)

## In Progress
- MongoDB connection (running, awaiting MongoDB instance)

## Pending Implementation
1. Health Records CRUD routes
2. Appointment Scheduling routes
3. ABHA ID linking and verification
4. Real-time notifications via Socket.io
5. Email notification system
6. File upload for health documents
7. Unit and integration tests
8. API documentation (Swagger/OpenAPI)

## Running the Backend

### Development Server
```bash
cd backend
npm run dev
```

Server runs at: http://localhost:5000

### Setup MongoDB
```bash
# Docker (Recommended)
docker run -d -p 27017:27017 --name healthconnect-mongo mongo:latest

# Or install locally and run: mongod
```

## API Endpoints (Implemented)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Health Check
- `GET /health` - Server health status

## Project Structure
```
backend/
├── src/
│   ├── config/database.js
│   ├── controllers/authController.js
│   ├── middleware/auth.js, errorHandler.js
│   ├── models/User.js, HealthRecord.js, Appointment.js
│   ├── routes/authRoutes.js
│   ├── utils/helpers.js
│   └── server.js
├── .env (configured)
├── .gitignore
├── package.json
├── README.md
└── QUICK_START.md
```

## Next Steps
1. Start MongoDB instance
2. Test API endpoints using curl or Postman
3. Implement Health Records routes
4. Implement Appointment routes
5. Integrate ABHA API
6. Add email notifications
7. Setup WebSocket events
8. Write comprehensive tests

## Commands Reference
- `npm run dev` - Start development server
- `npm start` - Production build
- `npm run lint` - Code linting
- `npm run format` - Code formatting
- `npm test` - Run tests

