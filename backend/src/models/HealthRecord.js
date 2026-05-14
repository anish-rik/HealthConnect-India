const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recordType: {
      type: String,
      enum: ['prescription', 'lab_report', 'visit_summary', 'discharge_summary', 'diagnostic_report'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    doctor: {
      name: String,
      qualification: String,
      hospital: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    medicines: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],
    labTests: [
      {
        testName: String,
        result: String,
        normalRange: String,
        unit: String,
      },
    ],
    diagnosis: String,
    treatmentPlan: String,
    sharedWith: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        accessLevel: {
          type: String,
          enum: ['view', 'edit', 'admin'],
          default: 'view',
        },
        grantedAt: Date,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
healthRecordSchema.index({ userId: 1, date: -1 });
healthRecordSchema.index({ recordType: 1 });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
