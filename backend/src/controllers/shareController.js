const ShareToken = require('../models/ShareToken');
const HealthRecord = require('../models/HealthRecord');
const User = require('../models/User');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/helpers');

/**
 * POST /api/share/generate
 * Authenticated — creates a share token for the logged-in user's records.
 */
const generateShareToken = async (req, res) => {
  try {
    const { expiryHours = 24, label, recordId } = req.body;

    // Cap expiry to 7 days max
    const hours = Math.min(Math.max(Number(expiryHours) || 24, 1), 168);
    const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

    const shareToken = new ShareToken({
      userId: req.user.id,
      expiresAt,
      label: label || 'Medical History QR',
      ...(recordId && { recordId }),
    });

    await shareToken.save();

    // Build the shareable URL — frontend will serve this
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const shareUrl = `${frontendUrl}/share/${shareToken.token}`;

    return sendSuccessResponse(res, 201, 'Share link created', {
      token: shareToken.token,
      shareUrl,
      expiresAt: shareToken.expiresAt,
      label: shareToken.label,
    });
  } catch (error) {
    console.error('Generate share token error:', error);
    return sendErrorResponse(res, 500, 'Failed to generate share link');
  }
};

/**
 * GET /api/share/my-tokens
 * Authenticated — list all active share tokens for the logged-in user.
 */
const listMyTokens = async (req, res) => {
  try {
    const tokens = await ShareToken.find({
      userId: req.user.id,
      isActive: true,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const data = tokens.map((t) => ({
      id: t._id,
      token: t.token,
      shareUrl: `${frontendUrl}/share/${t.token}`,
      label: t.label,
      expiresAt: t.expiresAt,
      accessCount: t.accessCount,
      createdAt: t.createdAt,
    }));

    return sendSuccessResponse(res, 200, 'Tokens retrieved', data);
  } catch (error) {
    console.error('List tokens error:', error);
    return sendErrorResponse(res, 500, 'Failed to list share tokens');
  }
};

/**
 * DELETE /api/share/:tokenId
 * Authenticated — revoke a share token.
 */
const revokeShareToken = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const shareToken = await ShareToken.findById(tokenId);
    if (!shareToken) {
      return sendErrorResponse(res, 404, 'Token not found');
    }

    if (shareToken.userId.toString() !== req.user.id) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    shareToken.isActive = false;
    await shareToken.save();

    return sendSuccessResponse(res, 200, 'Token revoked');
  } catch (error) {
    console.error('Revoke token error:', error);
    return sendErrorResponse(res, 500, 'Failed to revoke token');
  }
};

/**
 * GET /api/share/public/:token
 * PUBLIC (no auth) — returns the patient's timeline + basic info.
 */
const getPublicTimeline = async (req, res) => {
  try {
    const { token } = req.params;

    const shareToken = await ShareToken.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });

    if (!shareToken) {
      return sendErrorResponse(res, 404, 'This link has expired or is invalid');
    }

    // Increment access counter
    shareToken.accessCount += 1;
    await shareToken.save();

    // Fetch user info (limited fields)
    const user = await User.findById(shareToken.userId).select(
      'name gender dateOfBirth abhaId'
    );

    if (!user) {
      return sendErrorResponse(res, 404, 'Patient not found');
    }

    // Fetch health records
    let recordsQuery = { userId: shareToken.userId };
    if (shareToken.recordId) {
      recordsQuery = { _id: shareToken.recordId, userId: shareToken.userId };
    }

    // Fetch records, sorted chronologically
    const records = await HealthRecord.find(recordsQuery)
      .sort({ date: -1 })
      .lean();

    // Build timeline-friendly response
    const timeline = records.map((r) => ({
      id: r._id,
      type: r.recordType,
      title: r.title,
      description: r.description,
      date: r.date,
      doctor: r.doctor,
      diagnosis: r.diagnosis,
      treatmentPlan: r.treatmentPlan,
      medicines: r.medicines,
      labTests: r.labTests,
    }));

    return sendSuccessResponse(res, 200, 'Timeline retrieved', {
      patient: {
        name: user.name,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        abhaId: user.abhaId,
      },
      recordCount: timeline.length,
      timeline,
      expiresAt: shareToken.expiresAt,
    });
  } catch (error) {
    console.error('Public timeline error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve timeline');
  }
};

module.exports = {
  generateShareToken,
  listMyTokens,
  revokeShareToken,
  getPublicTimeline,
};
