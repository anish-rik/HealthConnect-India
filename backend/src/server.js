require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const recordsRoutes = require('./routes/recordsRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes');
const abhaRoutes = require('./routes/abhaRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compression
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/abha', abhaRoutes);

// WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Listen for appointment notifications
  socket.on('appointment-update', (data) => {
    console.log('Appointment update:', data);
    io.emit('appointment-notification', data);
  });

  // Listen for health record updates
  socket.on('record-update', (data) => {
    console.log('Record update:', data);
    io.emit('record-notification', data);
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ WebSocket running on ws://localhost:${PORT}`);
      console.log('✓ Press Ctrl+C to stop\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io };
