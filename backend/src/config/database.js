require('dotenv').config();
const mongoose = require('mongoose');

async function seedDatabaseIfNeeded() {
  const User = require('../models/User');
  const HealthRecord = require('../models/HealthRecord');
  const Appointment = require('../models/Appointment');
  const fs = require('fs');
  const path = require('path');
  
  const seedPath = path.join(__dirname, '../../../patients.seed.json');
  
  const existing = await User.findOne({ role: 'doctor' });
  if (!existing) {
    // Clear any existing data to be safe
    await User.deleteMany({});
    await HealthRecord.deleteMany({});
    await Appointment.deleteMany({});

    // 1. Create Doctor
    const demoDoctor = new User({
      name: 'Dr. Anita Desai',
      email: 'dr.desai@healthconnect.in',
      phone: '9876500000',
      password: 'Doctor123!',
      role: 'doctor',
      isVerified: true,
      gender: 'female',
      dateOfBirth: new Date('1980-05-20'),
      address: 'Apollo Hospital, Bangalore',
      language: 'en',
    });
    await demoDoctor.save();

    // 2. Read patients.seed.json and insert patients
    if (fs.existsSync(seedPath)) {
      const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      
      for (const patient of seedData.patients) {
        const email = `${patient.id.toLowerCase()}@example.com`;
        const dobYear = new Date().getFullYear() - patient.age;
        
        const newUser = new User({
          name: patient.name,
          email: email,
          phone: patient.phone.replace(/x/g, '0'), // Replace mask with 0 to pass validation
          password: 'Password123!',
          role: 'user',
          isVerified: true,
          gender: patient.gender,
          dateOfBirth: new Date(`${dobYear}-01-01`),
          address: patient.location,
          language: 'en',
          abhaId: patient.abhaId,
          abhaConsentId: `consent_${patient.id}`,
          abhaConsentStatus: 'APPROVED',
        });
        await newUser.save();

        const recordsToInsert = [];
        for (const evt of patient.timeline) {
          let recordType = 'visit_summary';
          if (evt.type === 'DischargeSummary') recordType = 'discharge_summary';
          else if (evt.type === 'DiagnosticReport') recordType = 'diagnostic_report';
          
          const medicines = evt.prescriptions ? evt.prescriptions.map(p => ({
            name: p,
            dosage: 'As prescribed',
            frequency: 'As prescribed',
            duration: 'As prescribed'
          })) : [];
          
          const labTests = evt.tests ? evt.tests.map(t => ({
            testName: t.name,
            result: t.value,
            normalRange: '',
            unit: ''
          })) : [];

          const attachments = evt.documents ? evt.documents.map(d => ({
            filename: d.title,
            url: d.fileUrl,
            uploadedAt: new Date(evt.date)
          })) : [];

          recordsToInsert.push({
            userId: newUser._id,
            recordType: recordType,
            title: evt.summary || evt.type,
            description: evt.summary,
            doctor: { 
              name: evt.doctorName || demoDoctor.name, 
              qualification: evt.doctorSpeciality || 'General Medicine', 
              hospital: evt.facilityName || 'Hospital' 
            },
            date: new Date(evt.date),
            diagnosis: evt.diagnosis ? evt.diagnosis.join(', ') : '',
            medicines: medicines,
            labTests: labTests,
            attachments: attachments
          });
        }
        if (recordsToInsert.length > 0) {
          await HealthRecord.insertMany(recordsToInsert);
        }
      }
      console.log('✓ Database seeded with patients from patients.seed.json');
    } else {
      console.warn('⚠ patients.seed.json not found at', seedPath);
    }
  }
}

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthconnect-india';
    
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✓ MongoDB connected successfully');
    
    await seedDatabaseIfNeeded();
    
    return mongoose.connection;
  } catch (error) {
    console.warn('⚠ MongoDB connection failed:', error.message);
    console.warn('⚠ Falling back to in-memory database (mongodb-memory-server)...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      await mongoose.connect(memoryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✓ In-memory MongoDB connected successfully');
      
      await seedDatabaseIfNeeded();
      
      return mongoose.connection;
    } catch (memError) {
      console.error('⚠ Failed to start in-memory database:', memError.message);
      return null;
    }
  }
};

module.exports = connectDB;
