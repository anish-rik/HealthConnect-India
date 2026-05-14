const Appointment = require('../models/Appointment');
const { sendErrorResponse, sendSuccessResponse } = require('../utils/helpers');

const listAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ userId: req.user.id }, { doctorId: req.user.id }],
    })
      .populate('userId', 'name email phone')
      .populate('doctorId', 'name email')
      .sort({ appointmentDate: -1 })
      .limit(50);

    return sendSuccessResponse(res, 200, 'Appointments retrieved', appointments);
  } catch (error) {
    console.error('List appointments error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve appointments');
  }
};

const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      timeSlot,
      reason,
      consultationType = 'in-person',
    } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return sendErrorResponse(
        res,
        400,
        'Doctor ID, appointment date, and time slot are required'
      );
    }

    const appointment = new Appointment({
      userId: req.user.id,
      doctorId,
      appointmentDate,
      timeSlot,
      reason,
      consultationType,
      status: 'scheduled',
    });

    await appointment.save();
    await appointment.populate('doctorId', 'name email');

    return sendSuccessResponse(res, 201, 'Appointment created', appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    return sendErrorResponse(res, 500, 'Failed to create appointment');
  }
};

const getAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate('userId', 'name email phone')
      .populate('doctorId', 'name email');

    if (!appointment) {
      return sendErrorResponse(res, 404, 'Appointment not found');
    }

    // Check access
    if (
      appointment.userId._id.toString() !== req.user.id &&
      appointment.doctorId._id.toString() !== req.user.id
    ) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    return sendSuccessResponse(res, 200, 'Appointment retrieved', appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    return sendErrorResponse(res, 500, 'Failed to retrieve appointment');
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, timeSlot, consultationType, consultationLink } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return sendErrorResponse(res, 404, 'Appointment not found');
    }

    // Only patient or doctor can update
    if (
      appointment.userId.toString() !== req.user.id &&
      appointment.doctorId.toString() !== req.user.id
    ) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    const updateData = {};
    if (appointmentDate) updateData.appointmentDate = appointmentDate;
    if (timeSlot) updateData.timeSlot = timeSlot;
    if (consultationType) updateData.consultationType = consultationType;
    if (consultationLink) updateData.consultationLink = consultationLink;

    const updated = await Appointment.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate('userId', 'name email')
      .populate('doctorId', 'name email');

    return sendSuccessResponse(res, 200, 'Appointment updated', updated);
  } catch (error) {
    console.error('Update appointment error:', error);
    return sendErrorResponse(res, 500, 'Failed to update appointment');
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return sendErrorResponse(res, 404, 'Appointment not found');
    }

    // Check access
    if (
      appointment.userId.toString() !== req.user.id &&
      appointment.doctorId.toString() !== req.user.id
    ) {
      return sendErrorResponse(res, 403, 'Access denied');
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user.id === appointment.userId.toString() ? 'patient' : 'doctor';
    appointment.cancelledReason = reason;

    await appointment.save();

    return sendSuccessResponse(res, 200, 'Appointment cancelled', appointment);
  } catch (error) {
    console.error('Cancel appointment error:', error);
    return sendErrorResponse(res, 500, 'Failed to cancel appointment');
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return sendErrorResponse(res, 404, 'Appointment not found');
    }

    // Only doctor can mark as completed
    if (appointment.doctorId.toString() !== req.user.id) {
      return sendErrorResponse(res, 403, 'Only doctor can complete appointment');
    }

    appointment.status = 'completed';
    if (notes) appointment.notes = notes;

    await appointment.save();

    return sendSuccessResponse(res, 200, 'Appointment marked as completed', appointment);
  } catch (error) {
    console.error('Complete appointment error:', error);
    return sendErrorResponse(res, 500, 'Failed to complete appointment');
  }
};

module.exports = {
  listAppointments,
  createAppointment,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
};
