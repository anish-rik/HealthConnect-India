const HealthRecord = require('../models/HealthRecord');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/helpers');

const listRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(50);

    return sendSuccessResponse(res, 200, 'Records retrieved', records);
  } catch (error) {
    console.error('List records error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve records');
  }
};

const createRecord = async (req, res) => {
  try {
    const { recordType, title, description, medicines, labTests, diagnosis, treatmentPlan, date } = req.body;

    if (!recordType || !title) {
      return sendErrorResponse(res, 400, 'Record type and title are required');
    }

    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date(),
    }));

    const record = new HealthRecord({
      userId: req.user.id,
      recordType,
      title,
      description,
      medicines,
      labTests,
      diagnosis,
      treatmentPlan,
      date: date || new Date(),
      attachments,
    });

    await record.save();

    return sendSuccessResponse(res, 201, 'Record created successfully', record);
  } catch (error) {
    console.error('Create record error:', error);
    return sendErrorResponse(res, 500, 'Failed to create record');
  }
};

const getRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await HealthRecord.findById(id);
    if (!record) {
      return sendErrorResponse(res, 404, 'Record not found');
    }

    // Check access
    if (record.userId.toString() !== req.user.id) {
      // Check if shared with user
      const hasAccess = record.sharedWith?.some(
        (s) => s.userId.toString() === req.user.id
      );
      if (!hasAccess && !record.isPublic) {
        return sendErrorResponse(res, 403, 'Access denied');
      }
    }

    return sendSuccessResponse(res, 200, 'Record retrieved', record);
  } catch (error) {
    console.error('Get record error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve record');
  }
};

const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const record = await HealthRecord.findById(id);
    if (!record) {
      return sendErrorResponse(res, 404, 'Record not found');
    }

    if (record.userId.toString() !== req.user.id) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    const updated = await HealthRecord.findByIdAndUpdate(id, updateData, { new: true });

    return sendSuccessResponse(res, 200, 'Record updated', updated);
  } catch (error) {
    console.error('Update record error:', error);
    return sendErrorResponse(res, 500, 'Failed to update record');
  }
};

const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await HealthRecord.findById(id);
    if (!record) {
      return sendErrorResponse(res, 404, 'Record not found');
    }

    if (record.userId.toString() !== req.user.id) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    await HealthRecord.findByIdAndDelete(id);

    return sendSuccessResponse(res, 200, 'Record deleted');
  } catch (error) {
    console.error('Delete record error:', error);
    return sendErrorResponse(res, 500, 'Failed to delete record');
  }
};

const shareRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, accessLevel = 'view' } = req.body;

    if (!userId) {
      return sendErrorResponse(res, 400, 'User ID is required');
    }

    const record = await HealthRecord.findById(id);
    if (!record) {
      return sendErrorResponse(res, 404, 'Record not found');
    }

    if (record.userId.toString() !== req.user.id) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    // Check if already shared
    const existingShare = record.sharedWith?.findIndex(
      (s) => s.userId.toString() === userId
    );

    if (existingShare !== -1) {
      record.sharedWith[existingShare].accessLevel = accessLevel;
    } else {
      record.sharedWith.push({
        userId,
        accessLevel,
        grantedAt: new Date(),
      });
    }

    await record.save();

    return sendSuccessResponse(res, 200, 'Record shared successfully', record);
  } catch (error) {
    console.error('Share record error:', error);
    return sendErrorResponse(res, 500, 'Failed to share record');
  }
};

module.exports = {
  listRecords,
  createRecord,
  getRecord,
  updateRecord,
  deleteRecord,
  shareRecord,
};
