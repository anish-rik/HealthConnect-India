const { body, param, validationResult } = require('express-validator');

/**
 * Middleware that checks for validation errors from express-validator
 * and returns a 400 response with details if any are found.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// ── Auth Validators ──────────────────────────────────────────────────────────

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be 2-100 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\d{10}$/)
    .withMessage('Phone must be a 10-digit Indian number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// ── Records Validators ──────────────────────────────────────────────────────

const validateCreateRecord = [
  body('recordType')
    .notEmpty()
    .withMessage('Record type is required')
    .isIn([
      'prescription',
      'lab_report',
      'visit_summary',
      'discharge_summary',
      'diagnostic_report',
    ])
    .withMessage('Invalid record type'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be under 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be under 2000 characters'),
  handleValidationErrors,
];

// ── Appointment Validators ───────────────────────────────────────────────────

const validateCreateAppointment = [
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isMongoId()
    .withMessage('Invalid doctor ID format'),
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Appointment date must be a valid ISO date'),
  body('timeSlot.startTime')
    .notEmpty()
    .withMessage('Start time is required')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('Start time must be HH:MM format'),
  body('timeSlot.endTime')
    .notEmpty()
    .withMessage('End time is required')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('End time must be HH:MM format'),
  body('consultationType')
    .optional()
    .isIn(['in-person', 'video', 'phone'])
    .withMessage('Invalid consultation type'),
  handleValidationErrors,
];

// ── ABHA Validators ─────────────────────────────────────────────────────────

const validateAbhaNumber = [
  body('abhaNumber')
    .notEmpty()
    .withMessage('ABHA number is required')
    .matches(/^\d{14}$/)
    .withMessage('ABHA number must be exactly 14 digits'),
  handleValidationErrors,
];

// ── Param Validators ────────────────────────────────────────────────────────

const validateMongoId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateCreateRecord,
  validateCreateAppointment,
  validateAbhaNumber,
  validateMongoId,
};
