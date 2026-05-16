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

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// List and create
router.get('/', listRecords);
router.post('/', upload.array('attachments', 5), createRecord);

// Get, update, delete
router.get('/:id', getRecord);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

// Share record
router.post('/:id/share', shareRecord);

module.exports = router;
