const express = require('express');
const {
  listRecords,
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
  shareRecord,
} = require('../controllers/recordsController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateCreateRecord, validateMongoId } = require('../middleware/validators');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// List and create
router.get('/', listRecords);
router.post('/', upload.array('attachments', 5), validateCreateRecord, createRecord);

// Get, update, delete
router.get('/:id', validateMongoId, getRecord);
router.put('/:id', validateMongoId, updateRecord);
router.delete('/:id', validateMongoId, deleteRecord);

// Share record
router.post('/:id/share', validateMongoId, shareRecord);

module.exports = router;
