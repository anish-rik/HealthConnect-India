const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function createDemoUser() {
  try {
    const directUri = 'mongodb+srv://HealthConnect:IPW_2026_NEON_VECTOR@cluster0.z6y6epw.mongodb.net/healthconnect-india?appName=Cluster0';
    await mongoose.connect(directUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB');

    const email = 'demo@healthconnect.in';
    const phone = '9999999999';
    const password = 'Password123!';

    // Remove if exists
    await User.deleteOne({ email });
    await User.deleteOne({ phone });

    // Create new
    const demoUser = new User({
      name: 'Demo User',
      email: email,
      phone: phone,
      password: password,
      role: 'user',
      isVerified: true,
      address: '123 Demo Street, Bangalore, India',
      gender: 'other',
      language: 'en'
    });

    await demoUser.save();
    console.log('Demo user created successfully:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to create demo user:', error);
    process.exit(1);
  }
}

createDemoUser();
