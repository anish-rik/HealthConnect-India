# HealthConnect India - Backend API

Backend API for HealthConnect India, a healthcare management system that allows users to access their health records securely via ABHA ID integration.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access control
- **ABHA Integration**: Link and verify ABHA ID for health records access
- **Health Records Management**: Store and retrieve medical documents (prescriptions, lab reports, etc.)
- **Appointment Scheduling**: Book and manage doctor appointments
- **Real-time Notifications**: WebSocket support for live updates
- **Multi-language Support**: Support for 7 Indian languages
- **Security**: Encrypted data storage, secure API endpoints

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB >= 4.0
- Docker (optional, for MongoDB)

## 🔧 Installation

### 1. Clone and Setup

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

**Key Configuration:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/healthconnect-india
JWT_SECRET=your-secure-secret-key
ABHA_CLIENT_ID=your-abha-client-id
ABHA_CLIENT_SECRET=your-abha-client-secret
FRONTEND_URL=http://localhost:5173
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# macOS: brew install mongodb-community
# Linux: Follow MongoDB official docs

mongod
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🏃 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123",
  "language": "en"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "female",
  "address": "123 Main St, City"
}
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Auth logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── HealthRecord.js      # Health records schema
│   │   └── Appointment.js       # Appointments schema
│   ├── routes/
│   │   └── authRoutes.js        # Auth routes
│   ├── services/
│   │   └── (External services)
│   ├── utils/
│   │   └── helpers.js           # Utility functions
│   └── server.js                # Main entry point
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🗄️ Database Schema

### User Model
- name, email, phone, password
- ABHA ID, language preference
- Role (user/doctor/admin)
- Verification status

### HealthRecord Model
- userId, recordType, title
- Doctor info, date, attachments
- Medicines, lab tests, diagnosis
- Sharing permissions

### Appointment Model
- userId, doctorId, date/time
- Consultation type (in-person/video/phone)
- Status tracking, reminders

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation
- ✅ Role-based access control
- ✅ Rate limiting ready (implement as needed)

## 🛠️ Development

### Linting
```bash
npm run lint
```

### Code Formatting
```bash
npm run format
```

### Testing
```bash
npm test
```

## 📝 Next Steps

1. **ABHA Integration**: Implement ABDM API client
2. **Health Records Routes**: Add CRUD endpoints
3. **Appointment Routes**: Add scheduling logic
4. **Email Notifications**: Integrate nodemailer
5. **File Upload**: Implement document storage
6. **Testing**: Add unit and integration tests
7. **Deployment**: Setup Docker and CI/CD

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- Ensure MongoDB is running
- Check MONGODB_URI in .env

### JWT Token Error
```
Error: Invalid or expired token
```
- Include token in Authorization header: `Bearer <token>`
- Regenerate token after expiry

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
- Verify FRONTEND_URL in .env matches your frontend URL
- Check CORS configuration in server.js

## 📞 Support

For issues or questions, contact the development team.

## 📄 License

MIT License - See LICENSE file for details
