# HealthConnect Backend - Quick Start Guide

## ✅ Backend Server is Running!

Your Express.js backend is now running at:
- **API**: http://localhost:5000
- **WebSocket**: ws://localhost:5000
- **Status**: ⚠️ Waiting for MongoDB connection

---

## 🚀 What to Do Next

### Step 1: Setup MongoDB (Choose One)

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name healthconnect-mongo mongo:latest
```

**Option B: Local MongoDB Installation**
- Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- macOS: `brew install mongodb-community`
- Linux: Follow MongoDB official documentation

**Option C: Cloud MongoDB (MongoDB Atlas)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Update `MONGODB_URI` in `.env`

### Step 2: Verify Backend Connection

Once MongoDB is running, the server will show:
```
✓ MongoDB connected successfully
```

### Step 3: Test API Endpoints

**Health Check**
```bash
curl http://localhost:5000/health
```

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "password": "Password123",
    "confirmPassword": "Password123",
    "language": "en"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

---

## 📋 Project Structure

```
backend/
├── src/
│   ├── config/database.js         - MongoDB connection
│   ├── controllers/authController.js - Auth logic
│   ├── middleware/                - Auth & error handling
│   ├── models/                    - Schemas (User, HealthRecord, Appointment)
│   ├── routes/authRoutes.js       - API routes
│   ├── utils/helpers.js           - Helper functions
│   └── server.js                  - Main entry point
├── .env                           - Configuration (update MONGODB_URI)
├── package.json
└── README.md
```

---

## 🔧 Available Commands

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test
```

---

## 📚 Key Features Implemented

✅ User Registration & Login (JWT)  
✅ User Profile Management  
✅ JWT Authentication Middleware  
✅ Role-Based Access Control  
✅ Error Handling  
✅ WebSocket Support  
✅ CORS Configuration  
✅ Security Headers (Helmet)  

---

## 🗂️ Next Features to Build

1. **Health Records Routes**
   - GET /api/records - List user's health records
   - POST /api/records - Upload new record
   - GET /api/records/:id - Get specific record
   - PUT/DELETE /api/records/:id - Update/delete record

2. **Appointments Routes**
   - GET /api/appointments - List appointments
   - POST /api/appointments - Book appointment
   - PUT /api/appointments/:id - Reschedule
   - DELETE /api/appointments/:id - Cancel

3. **ABHA Integration**
   - Link ABHA ID to user account
   - Fetch health records from ABDM

4. **Notifications**
   - Email notifications
   - Push notifications
   - WebSocket real-time updates

---

## ⚙️ Environment Variables

Edit `.env` file with your settings:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthconnect-india
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

---

## 🆘 Troubleshooting

**"MongoDB connection refused"**
→ Start MongoDB or Docker container

**"Port already in use"**
→ Change PORT in .env or kill process on 5000

**"nodemon command not found"**
→ Run `npm install` again

---

## 📞 Frontend Integration

Your frontend at `http://localhost:5173` can now communicate with the backend:

```javascript
// Example API call
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data);
```

---

## 🎉 You're All Set!

Backend is ready. Now:
1. Start MongoDB
2. Connect your frontend
3. Begin building features!

For detailed API docs, see `README.md`
