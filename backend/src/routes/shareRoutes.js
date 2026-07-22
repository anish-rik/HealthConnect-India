const express = require('express');
const {
  generateShareToken,
  listMyTokens,
  revokeShareToken,
  getPublicTimeline,
} = require('../controllers/shareController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// ── Public route (no auth) ──────────────────────────────────────────────────
router.get('/public/:token', getPublicTimeline);

// ── Authenticated routes ────────────────────────────────────────────────────
router.post('/generate', authenticateToken, generateShareToken);
router.get('/my-tokens', authenticateToken, listMyTokens);
router.delete('/:tokenId', authenticateToken, revokeShareToken);

module.exports = router;
