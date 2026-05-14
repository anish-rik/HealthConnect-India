# Quick Setup Guide for Gourav 👋

Welcome to the HealthConnect India project! Here's how to get started quickly.

## 📥 Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/anish-rik/HealthConnect-India.git
cd HealthConnect-India

# Install root dependencies (if any)
npm install
```

## 🔐 Step 2: Configure Backend

```bash
cd backend

# Install backend dependencies
npm install

# Create .env file (copy from .env.example)
# Ask Anish for the MongoDB Atlas connection string
# Edit .env and add:
# MONGODB_URI=<your-connection-string>
```

**Backend .env file needs:**
- `MONGODB_URI` - MongoDB Atlas connection string (ask Anish)
- `JWT_SECRET` - Keep as is for now
- `FRONTEND_URL` - Already set to `http://localhost:5173`

## 🎨 Step 3: Configure Frontend

```bash
# Go back to root
cd ../HealthConnect-India

# Install frontend dependencies
npm install

# No .env needed for development (uses default localhost:5000)
```

## 🚀 Step 4: Start Everything

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Should show: ✓ Server running on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd HealthConnect-India
npm run dev
# Should show: ➜ Local: http://localhost:5173/
```

## ✅ Verification

1. Open http://localhost:5173 in your browser
2. You should see the HealthConnect landing page
3. Click on "Link ABHA ID" button to test
4. Check browser console (F12) for any errors

## 📚 Next Steps

Once everything is running:

1. **Explore the codebase:**
   - Frontend pages in `HealthConnect-India/src/routes/`
   - Backend API in `backend/src/routes/`
   - UI components in `HealthConnect-India/src/components/`

2. **Understand the architecture:**
   - Frontend sends requests to Backend API
   - Backend stores data in MongoDB
   - API client is at `HealthConnect-India/src/lib/apiClient.ts`

3. **Features to work on:**
   - Login/Register pages (frontend pages exist, need API integration)
   - Dashboard (incomplete)
   - Health records upload
   - Appointment scheduling

4. **Testing:**
   - Use Postman to test API endpoints
   - Test in browser for UI issues

## 🆘 Common Issues

### "Cannot connect to MongoDB"
- ✓ MongoDB connection is optional for development
- Backend will start anyway, just no data persistence
- Once you add MongoDB URI to .env, it will connect

### "Frontend shows blank page"
- Check browser console (F12) for errors
- Verify backend is running on port 5000
- Clear browser cache and refresh

### "CORS error when calling API"
- Ensure backend is running
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS is enabled in backend (should be)

## 💡 Development Tips

- **Auto-reload:** Both frontend and backend auto-reload on file changes
- **Git workflow:** Create branches for features
- **Commit messages:** Use descriptive names
- **Testing:** Test accessibility features with keyboard + screen reader

## 📞 Questions?

Ask Anish!
- Email: reach.anishc@gmail.com
- GitHub Issues: https://github.com/anish-rik/HealthConnect-India/issues

## 🎯 Current Status

- ✅ Frontend landing page (with accessibility)
- ✅ Backend API structure
- ✅ Database connected (MongoDB Atlas)
- ⏳ Login/Register pages (UI ready, API incomplete)
- ⏳ Dashboard (UI structure ready, needs data integration)
- ⏳ Health records management
- ⏳ Appointment scheduling

**Let's build something amazing! 🚀**

---
*Created: May 14, 2026*
