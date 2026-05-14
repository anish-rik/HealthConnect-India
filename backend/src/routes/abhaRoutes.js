const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const abdmService = require('../services/abdmService');
const User = require('../models/User');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/helpers');

const router = express.Router();

router.use(authenticateToken);

router.post('/verify', async (req, res) => {
  try {
    const { abhaNumber } = req.body;

    if (!abhaNumber) {
      return sendErrorResponse(res, 400, 'ABHA number is required');
    }

    const result = await abdmService.verifyABHA(abhaNumber);

    if (!result.exists) {
      return sendErrorResponse(res, 404, result.error || 'ABHA number not found or invalid');
    }

    return sendSuccessResponse(res, 200, 'ABHA verified successfully', result.user);
  } catch (error) {
    console.error('ABHA verification error:', error.message || error);
    return sendErrorResponse(res, 500, error.message || 'Failed to verify ABHA number');
  }
});

router.post('/link', async (req, res) => {
  try {
    const { abhaNumber } = req.body;
    const userId = req.user.id;

    if (!abhaNumber) {
      return sendErrorResponse(res, 400, 'ABHA number is required');
    }

    const verification = await abdmService.verifyABHA(abhaNumber);
    if (!verification.exists) {
      return sendErrorResponse(res, 404, verification.error || 'Invalid ABHA number');
    }

    const existingUser = await User.findOne({ abhaId: abhaNumber });
    if (existingUser && existingUser._id.toString() !== userId) {
      return sendErrorResponse(res, 409, 'ABHA number already linked to another account');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { abhaId: abhaNumber },
      { new: true }
    ).select('-password');

    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    return sendSuccessResponse(res, 200, 'ABHA linked successfully', {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        abhaId: user.abhaId,
      },
    });
  } catch (error) {
    console.error('ABHA linking error:', error.message || error);
    return sendErrorResponse(res, 500, error.message || 'Failed to link ABHA');
  }
});

router.post('/consent-request', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.abhaId) {
      return sendErrorResponse(res, 400, 'ABHA not linked to account');
    }

    const consentRequest = await abdmService.createConsentRequest(user.abhaId, userId);
    user.abhaConsentId = consentRequest.consentId || consentRequest.id || user.abhaConsentId;
    user.abhaConsentStatus = consentRequest.status || 'PENDING';
    await user.save();

    return sendSuccessResponse(res, 201, 'Consent request created', consentRequest);
  } catch (error) {
    console.error('Consent request error:', error.message || error);
    return sendErrorResponse(res, 500, error.message || 'Failed to create consent request');
  }
});

router.get('/consent-status', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.abhaConsentId) {
      return sendErrorResponse(res, 400, 'Consent request not found');
    }

    const status = await abdmService.getConsentStatus(user.abhaConsentId);
    user.abhaConsentStatus = status.status || user.abhaConsentStatus;
    await user.save();

    return sendSuccessResponse(res, 200, 'Consent status retrieved', status);
  } catch (error) {
    console.error('Consent status error:', error.message || error);
    return sendErrorResponse(res, 500, error.message || 'Failed to retrieve consent status');
  }
});

router.get('/health-records', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.abhaId) {
      return sendErrorResponse(res, 400, 'ABHA not linked to account');
    }

    if (!user.abhaConsentId) {
      return sendErrorResponse(res, 400, 'Consent request not created yet');
    }

    const records = await abdmService.fetchHealthRecords(user.abhaConsentId);
    return sendSuccessResponse(res, 200, 'Health records fetched successfully', records);
  } catch (error) {
    console.error('Health records fetch error:', error.message || error);
    return sendErrorResponse(res, 500, error.message || 'Failed to fetch health records');
  }
});

router.get('/status', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('abhaId abhaConsentId abhaConsentStatus name email');

    if (!user) {
      return sendErrorResponse(res, 404, 'User not found');
    }

    return sendSuccessResponse(res, 200, 'ABHA status retrieved', {
      isLinked: !!user.abhaId,
      abhaId: user.abhaId,
      abhaConsentId: user.abhaConsentId,
      abhaConsentStatus: user.abhaConsentStatus,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('ABHA status error:', error.message || error);
    return sendErrorResponse(res, 500, error.message || 'Failed to get ABHA status');
  }
});

module.exports = router;
