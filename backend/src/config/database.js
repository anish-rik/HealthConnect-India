require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthconnect-india';
    
    console.log('Attempting to connect to MongoDB...');
    
    // Mongoose 7+ no longer requires useNewUrlParser / useUnifiedTopology
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✓ MongoDB connected successfully');
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
      
      // Auto-seed demo users, doctor, records, and appointments
      const User = require('../models/User');
      const HealthRecord = require('../models/HealthRecord');
      const Appointment = require('../models/Appointment');
      
      const demoEmail1 = 'test@example.com';
      const demoEmail2 = 'demo@healthconnect.in';
      
      const existing = await User.findOne({ email: demoEmail1 });
      if (!existing) {
        // 1. Create Male Demo User
        const demoUserMale = new User({
          name: 'Rajesh Kumar',
          email: demoEmail1,
          phone: '9876543210',
          password: 'Password123!',
          role: 'user',
          isVerified: true,
          gender: 'male',
          dateOfBirth: new Date('1975-08-15'),
          address: '42, MG Road, Indiranagar, Bangalore',
          language: 'en',
          abhaId: '91782560349180',
          abhaConsentId: `consent_demo_${Date.now()}_1`,
          abhaConsentStatus: 'APPROVED',
        });
        await demoUserMale.save();
        
        // 2. Create Female Demo User
        const demoUserFemale = new User({
          name: 'Priya Sharma',
          email: demoEmail2,
          phone: '9999999999',
          password: 'Password123!',
          role: 'user',
          isVerified: true,
          gender: 'female',
          dateOfBirth: new Date('1982-03-10'),
          address: '15, Park Street, Kolkata',
          language: 'en',
          abhaId: '12345678901234',
          abhaConsentId: `consent_demo_${Date.now()}_2`,
          abhaConsentStatus: 'APPROVED',
        });
        await demoUserFemale.save();

        // 3. Create Doctor
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

        // 4. Create Health Records for Male User (Rajesh)
        const maleRecords = [
          {
            userId: demoUserMale._id,
            recordType: 'visit_summary',
            title: 'Annual Health Checkup',
            description: 'Routine annual health screening. Patient reports mild fatigue. Blood pressure slightly elevated.',
            doctor: { name: demoDoctor.name, qualification: 'MBBS, MD', hospital: 'Apollo Hospital' },
            date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
            diagnosis: 'Pre-hypertension',
            treatmentPlan: 'Lifestyle modifications, low sodium diet.',
            medicines: [{ name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }]
          },
          {
            userId: demoUserMale._id,
            recordType: 'lab_report',
            title: 'Lipid Profile',
            description: 'Routine cholesterol check.',
            doctor: { name: demoDoctor.name, qualification: 'MBBS, MD', hospital: 'Apollo Hospital' },
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
            diagnosis: 'Borderline high cholesterol',
            labTests: [
              { testName: 'Total Cholesterol', result: '220', normalRange: '<200', unit: 'mg/dL' },
              { testName: 'LDL', result: '140', normalRange: '<100', unit: 'mg/dL' }
            ]
          }
        ];

        // 5. Create Health Records for Female User (Priya)
        const femaleRecords = [
          {
            userId: demoUserFemale._id,
            recordType: 'prescription',
            title: 'Thyroid Management',
            description: 'Follow-up for hypothyroidism.',
            doctor: { name: demoDoctor.name, qualification: 'MBBS, MD', hospital: 'Apollo Hospital' },
            date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
            diagnosis: 'Hypothyroidism',
            treatmentPlan: 'Continue medication, re-evaluate in 6 months.',
            medicines: [{ name: 'Thyroxine', dosage: '50mcg', frequency: 'Once daily morning', duration: '180 days' }]
          },
          {
            userId: demoUserFemale._id,
            recordType: 'diagnostic_report',
            title: 'Ultrasound Abdomen',
            description: 'Routine scan for abdominal pain.',
            doctor: { name: demoDoctor.name, qualification: 'MBBS, MD', hospital: 'Apollo Hospital' },
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
            diagnosis: 'Normal study. No significant abnormality detected.',
          }
        ];

        await HealthRecord.insertMany([...maleRecords, ...femaleRecords]);

        // 6. Create Appointments
        const appointments = [
          {
            userId: demoUserMale._id,
            doctorId: demoDoctor._id,
            appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
            timeSlot: { startTime: '10:00', endTime: '10:30' },
            reason: 'Cardiology Checkup',
            status: 'scheduled',
            consultationType: 'in-person'
          },
          {
            userId: demoUserFemale._id,
            doctorId: demoDoctor._id,
            appointmentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
            timeSlot: { startTime: '14:00', endTime: '14:30' },
            reason: 'Thyroid Report Review',
            status: 'completed',
            consultationType: 'video',
            notes: 'Reports look fine. Continue current dose.'
          }
        ];

        await Appointment.insertMany(appointments);

        console.log('✓ In-memory database seeded with demo users, records, and appointments');
      }
      
      return mongoose.connection;
    } catch (memError) {
      console.error('⚠ Failed to start in-memory database:', memError.message);
      return null;
    }
  }
};

module.exports = connectDB;
