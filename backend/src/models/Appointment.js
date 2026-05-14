const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      startTime: {
        type: String, // HH:MM format
        required: true,
      },
      endTime: {
        type: String,   // HH:MM format
        required: true,
      },
    },
    reason: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show'],
      default: 'scheduled',
    },
    consultationType: {
      type: String,
      enum: ['in-person', 'video', 'phone'],
      default: 'in-person',
    },
    consultationLink: String, // For video consultations
    notes: String,
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthRecord',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
    },
    cancelledReason: String,
  },
  { timestamps: true }
);

// Index for faster queries
appointmentSchema.index({ userId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
