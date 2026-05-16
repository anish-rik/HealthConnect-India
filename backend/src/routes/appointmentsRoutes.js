const express = require('express');
const {
  listAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
} = require('../controllers/appointmentsController');
const { authenticateToken } = require('../middleware/auth');
const { validateCreateAppointment, validateMongoId } = require('../middleware/validators');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// List and create
router.get('/', listAppointments);
router.post('/', validateCreateAppointment, createAppointment);

// Get and update
router.get('/:id', validateMongoId, getAppointment);
router.put('/:id', validateMongoId, updateAppointment);

// Cancel and complete
router.post('/:id/cancel', validateMongoId, cancelAppointment);
router.post('/:id/complete', validateMongoId, completeAppointment);

module.exports = router;
