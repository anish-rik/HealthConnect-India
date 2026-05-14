require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthconnect-india';
    
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✓ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.warn('⚠ MongoDB connection warning:', error.message);
    console.warn('⚠ Server starting without database connection.');
    console.warn('⚠ Some features will be unavailable until MongoDB is connected.');
    return null;
  }
};

module.exports = connectDB;

