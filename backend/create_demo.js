const mongoose = require('mongoose');
const User = require('./src/models/User');
const HealthRecord = require('./src/models/HealthRecord');
const Appointment = require('./src/models/Appointment');
require('dotenv').config();

// ── Demo ABHA ID (14-digit) ──────────────────────────────────────────────────
// This is a mock ABHA number for local testing. It is also added to the ABDM
// service mock whitelist so verify / link / consent flows work out of the box.
const DEMO_ABHA_ID = '91-7825-6034-9180';
const DEMO_ABHA_RAW = '91782560349180'; // digits only (14)

async function createDemoData() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb+srv://HealthConnect:IPW_2026_NEON_VECTOR@cluster0.z6y6epw.mongodb.net/healthconnect-india?appName=Cluster0';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✓ Connected to DB\n');

    // ─── 1. Demo User ──────────────────────────────────────────────────────────
    const email = 'demo@healthconnect.in';
    const phone = '9999999999';
    const password = 'Password123!';

    await User.deleteOne({ email });
    await User.deleteOne({ phone });

    const demoUser = new User({
      name: 'Rajesh Kumar',
      email,
      phone,
      password,
      role: 'user',
      isVerified: true,
      address: '42, MG Road, Indiranagar, Bangalore 560038',
      gender: 'male',
      language: 'en',
      dateOfBirth: new Date('1975-08-15'),
      abhaId: DEMO_ABHA_RAW,
      abhaConsentId: `consent_demo_${Date.now()}`,
      abhaConsentStatus: 'APPROVED',
    });

    await demoUser.save();
    console.log('✓ Demo user created');
    console.log(`  Name     : ${demoUser.name}`);
    console.log(`  Email    : ${email}`);
    console.log(`  Password : ${password}`);
    console.log(`  Phone    : ${phone}`);
    console.log(`  ABHA ID  : ${DEMO_ABHA_ID}`);
    console.log(`  Gender   : ${demoUser.gender}`);
    console.log(`  DOB      : ${demoUser.dateOfBirth.toISOString().split('T')[0]}`);
    console.log();

    // ─── 2. Demo Doctor ────────────────────────────────────────────────────────
    const doctorEmail = 'dr.sharma@healthconnect.in';
    await User.deleteOne({ email: doctorEmail });

    const demoDoctor = new User({
      name: 'Dr. Anita Sharma',
      email: doctorEmail,
      phone: '9876543210',
      password: 'Doctor123!',
      role: 'doctor',
      isVerified: true,
      address: 'Fortis Hospital, Bannerghatta Road, Bangalore',
      gender: 'female',
      language: 'en',
      dateOfBirth: new Date('1980-03-22'),
    });

    await demoDoctor.save();
    console.log('✓ Demo doctor created');
    console.log(`  Name     : ${demoDoctor.name}`);
    console.log(`  Email    : ${doctorEmail}`);
    console.log(`  Password : Doctor123!`);
    console.log();

    // ─── 3. Health Records (Timeline Data) ─────────────────────────────────────
    // Remove old demo records
    await HealthRecord.deleteMany({ userId: demoUser._id });

    const healthRecords = [
      // ── 6 months ago: Annual health checkup ──
      {
        userId: demoUser._id,
        recordType: 'visit_summary',
        title: 'Annual Health Checkup',
        description: 'Routine annual health screening. Patient reports mild fatigue and occasional headaches. Blood pressure slightly elevated at 140/90 mmHg.',
        doctor: {
          name: 'Dr. Anita Sharma',
          qualification: 'MBBS, MD (Internal Medicine)',
          hospital: 'Fortis Hospital, Bangalore',
        },
        date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        diagnosis: 'Pre-hypertension, Vitamin D deficiency',
        treatmentPlan: 'Lifestyle modifications, dietary changes, follow-up in 3 months. Start Vitamin D supplementation.',
        medicines: [
          { name: 'Vitamin D3', dosage: '60,000 IU', frequency: 'Once weekly', duration: '8 weeks' },
          { name: 'Calcium + D3', dosage: '500mg', frequency: 'Once daily', duration: '3 months' },
        ],
        labTests: [
          { testName: 'Vitamin D (25-OH)', result: '12', normalRange: '30-100', unit: 'ng/mL' },
          { testName: 'Blood Pressure', result: '140/90', normalRange: '<120/80', unit: 'mmHg' },
          { testName: 'Fasting Blood Sugar', result: '98', normalRange: '70-100', unit: 'mg/dL' },
        ],
      },

      // ── 5 months ago: Lab report ──
      {
        userId: demoUser._id,
        recordType: 'lab_report',
        title: 'Complete Blood Count (CBC)',
        description: 'Routine CBC as part of annual checkup workup.',
        doctor: {
          name: 'Dr. Anita Sharma',
          qualification: 'MBBS, MD (Internal Medicine)',
          hospital: 'Fortis Hospital, Bangalore',
        },
        date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000),
        diagnosis: 'Normal CBC, mild Vitamin B12 deficiency',
        labTests: [
          { testName: 'Hemoglobin', result: '14.2', normalRange: '13.5-17.5', unit: 'g/dL' },
          { testName: 'WBC Count', result: '7200', normalRange: '4000-11000', unit: '/µL' },
          { testName: 'Platelet Count', result: '245000', normalRange: '150000-400000', unit: '/µL' },
          { testName: 'RBC Count', result: '5.1', normalRange: '4.5-5.5', unit: 'million/µL' },
          { testName: 'Vitamin B12', result: '180', normalRange: '200-900', unit: 'pg/mL' },
          { testName: 'HbA1c', result: '5.6', normalRange: '<5.7', unit: '%' },
        ],
      },

      // ── 4 months ago: Prescription ──
      {
        userId: demoUser._id,
        recordType: 'prescription',
        title: 'Hypertension Management',
        description: 'Follow-up visit. Blood pressure still elevated despite lifestyle changes. Starting medication.',
        doctor: {
          name: 'Dr. Vikram Reddy',
          qualification: 'MBBS, MD (Cardiology)',
          hospital: 'Narayana Health, Bangalore',
        },
        date: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        diagnosis: 'Stage 1 Hypertension',
        treatmentPlan: 'Start Amlodipine 5mg daily. Continue low-sodium diet. Monitor BP at home twice daily. Follow-up in 4 weeks.',
        medicines: [
          { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily (morning)', duration: 'Long-term' },
          { name: 'Ecosprin', dosage: '75mg', frequency: 'Once daily (after lunch)', duration: 'Long-term' },
        ],
        labTests: [
          { testName: 'Blood Pressure', result: '148/92', normalRange: '<120/80', unit: 'mmHg' },
          { testName: 'Serum Creatinine', result: '1.0', normalRange: '0.7-1.3', unit: 'mg/dL' },
        ],
      },

      // ── 3 months ago: Follow-up visit ──
      {
        userId: demoUser._id,
        recordType: 'visit_summary',
        title: 'Cardiology Follow-Up',
        description: 'Follow-up after starting Amlodipine. Patient reports improved energy, no dizziness. BP well-controlled on medication.',
        doctor: {
          name: 'Dr. Vikram Reddy',
          qualification: 'MBBS, MD (Cardiology)',
          hospital: 'Narayana Health, Bangalore',
        },
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        diagnosis: 'Hypertension — controlled on medication',
        treatmentPlan: 'Continue Amlodipine 5mg. Recheck lipid profile. Next follow-up in 3 months.',
        labTests: [
          { testName: 'Blood Pressure', result: '128/82', normalRange: '<120/80', unit: 'mmHg' },
        ],
      },

      // ── 2 months ago: Lipid profile lab report ──
      {
        userId: demoUser._id,
        recordType: 'lab_report',
        title: 'Lipid Profile & Liver Function Test',
        description: 'Lipid panel and LFT ordered during cardiology follow-up.',
        doctor: {
          name: 'Dr. Vikram Reddy',
          qualification: 'MBBS, MD (Cardiology)',
          hospital: 'Narayana Health, Bangalore',
        },
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        diagnosis: 'Borderline high cholesterol',
        treatmentPlan: 'Dietary modifications. Increase fiber intake. Recheck in 3 months before considering statins.',
        labTests: [
          { testName: 'Total Cholesterol', result: '225', normalRange: '<200', unit: 'mg/dL' },
          { testName: 'LDL Cholesterol', result: '145', normalRange: '<100', unit: 'mg/dL' },
          { testName: 'HDL Cholesterol', result: '48', normalRange: '>40', unit: 'mg/dL' },
          { testName: 'Triglycerides', result: '160', normalRange: '<150', unit: 'mg/dL' },
          { testName: 'SGOT (AST)', result: '28', normalRange: '10-40', unit: 'U/L' },
          { testName: 'SGPT (ALT)', result: '32', normalRange: '7-56', unit: 'U/L' },
        ],
      },

      // ── 1 month ago: Diagnostic report (ECG) ──
      {
        userId: demoUser._id,
        recordType: 'diagnostic_report',
        title: 'ECG & 2D Echocardiogram',
        description: 'Cardiac evaluation as part of hypertension management protocol. No chest pain or palpitations reported.',
        doctor: {
          name: 'Dr. Vikram Reddy',
          qualification: 'MBBS, MD (Cardiology)',
          hospital: 'Narayana Health, Bangalore',
        },
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        diagnosis: 'Normal sinus rhythm. Normal left ventricular function. EF 62%.',
        treatmentPlan: 'Continue current medications. Annual echo recommended.',
      },

      // ── 2 weeks ago: Eye checkup ──
      {
        userId: demoUser._id,
        recordType: 'visit_summary',
        title: 'Ophthalmology Consultation',
        description: 'Routine eye exam. Patient reports mild blurring of vision while reading. Fundus examination normal.',
        doctor: {
          name: 'Dr. Priya Nair',
          qualification: 'MBBS, MS (Ophthalmology)',
          hospital: 'Sankara Eye Hospital, Bangalore',
        },
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        diagnosis: 'Presbyopia (age-related near vision difficulty)',
        treatmentPlan: 'Prescribed reading glasses +1.5D. Annual retinal exam recommended due to hypertension.',
        medicines: [
          { name: 'Refresh Tears Eye Drops', dosage: '1 drop', frequency: 'Twice daily', duration: '1 month' },
        ],
      },

      // ── 3 days ago: Dental visit ──
      {
        userId: demoUser._id,
        recordType: 'visit_summary',
        title: 'Dental Checkup & Cleaning',
        description: 'Biannual dental cleaning. Mild tartar buildup removed. No cavities. Gum health satisfactory.',
        doctor: {
          name: 'Dr. Suresh Menon',
          qualification: 'BDS, MDS (Periodontics)',
          hospital: 'Clove Dental, Indiranagar',
        },
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        diagnosis: 'Mild gingivitis, no caries',
        treatmentPlan: 'Professional cleaning done. Use soft-bristle brush. Follow up in 6 months.',
        medicines: [
          { name: 'Chlorhexidine Mouthwash', dosage: '10ml', frequency: 'Twice daily (after brushing)', duration: '2 weeks' },
        ],
      },
    ];

    const createdRecords = await HealthRecord.insertMany(healthRecords);
    console.log(`✓ ${createdRecords.length} health records created (for timeline)`);
    createdRecords.forEach((r) => {
      const d = new Date(r.date).toLocaleDateString('en-IN');
      console.log(`  [${r.recordType.padEnd(18)}] ${d} — ${r.title}`);
    });
    console.log();

    // ─── 4. Appointments ───────────────────────────────────────────────────────
    await Appointment.deleteMany({ userId: demoUser._id });

    const appointments = [
      // Past completed appointment
      {
        userId: demoUser._id,
        doctorId: demoDoctor._id,
        appointmentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        timeSlot: { startTime: '10:00', endTime: '10:30' },
        reason: 'Hypertension follow-up & ECG review',
        status: 'completed',
        consultationType: 'in-person',
        notes: 'BP well-controlled. ECG normal. Continue medications.',
      },
      // Past completed (video)
      {
        userId: demoUser._id,
        doctorId: demoDoctor._id,
        appointmentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        timeSlot: { startTime: '16:00', endTime: '16:15' },
        reason: 'Prescription refill — Amlodipine & Ecosprin',
        status: 'completed',
        consultationType: 'video',
        consultationLink: 'https://meet.healthconnect.in/demo-room',
        notes: 'Refilled medications for 3 months.',
      },
      // Upcoming scheduled appointment
      {
        userId: demoUser._id,
        doctorId: demoDoctor._id,
        appointmentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        timeSlot: { startTime: '11:00', endTime: '11:30' },
        reason: 'Quarterly cardiology check-up',
        status: 'scheduled',
        consultationType: 'in-person',
      },
      // Upcoming scheduled appointment (phone)
      {
        userId: demoUser._id,
        doctorId: demoDoctor._id,
        appointmentDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        timeSlot: { startTime: '14:00', endTime: '14:15' },
        reason: 'Lab results discussion — Lipid profile recheck',
        status: 'scheduled',
        consultationType: 'phone',
      },
    ];

    const createdAppointments = await Appointment.insertMany(appointments);
    console.log(`✓ ${createdAppointments.length} appointments created`);
    createdAppointments.forEach((a) => {
      const d = new Date(a.appointmentDate).toLocaleDateString('en-IN');
      console.log(`  [${a.status.padEnd(10)}] ${d} ${a.timeSlot.startTime} — ${a.reason}`);
    });

    // ─── Summary ───────────────────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(60));
    console.log('  DEMO ACCOUNT READY');
    console.log('═'.repeat(60));
    console.log(`  Email       : ${email}`);
    console.log(`  Password    : ${password}`);
    console.log(`  ABHA ID     : ${DEMO_ABHA_ID}`);
    console.log(`  ABHA (raw)  : ${DEMO_ABHA_RAW}`);
    console.log(`  Records     : ${createdRecords.length}`);
    console.log(`  Appointments: ${createdAppointments.length}`);
    console.log('═'.repeat(60));
    console.log('\n  Login at the frontend and test:');
    console.log('  • Dashboard → timeline of health records');
    console.log('  • ABHA Link → verify/link ABHA, fetch mock records');
    console.log('  • Records tab → view medical history & upload');
    console.log('  • Profile → QR code generation with ABHA ID\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to create demo data:', error);
    process.exit(1);
  }
}

createDemoData();
