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

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// List and create
router.get('/', listAppointments);
router.post('/', createAppointment);

// Get and update
router.get('/:id', getAppointment);
router.put('/:id', updateAppointment);

// Cancel and complete
router.post('/:id/cancel', cancelAppointment);
router.post('/:id/complete', completeAppointment);

module.exports = router;
