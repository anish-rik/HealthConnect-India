const mongoose = require('mongoose');
const crypto = require('crypto');

const shareTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(32).toString('hex'),
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: {
      type: String,
      default: 'Medical History QR',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    accessCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-expire index: MongoDB will remove docs after expiresAt
shareTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
shareTokenSchema.index({ token: 1 });
shareTokenSchema.index({ userId: 1 });

module.exports = mongoose.model('ShareToken', shareTokenSchema);
