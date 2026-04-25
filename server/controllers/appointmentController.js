import Appointment from '../models/Appointment.js';

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      user: req.user._id,
      ...req.body
    });
    
    res.status(201).json({ success: true, data: appointment, message: 'Appointment booked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user appointments
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Pay for appointment
export const payForAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot pay for cancelled appointment' });
    }
    
    if (appointment.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Appointment already paid' });
    }
    
    appointment.status = 'paid';
    await appointment.save();
    
    res.json({ success: true, message: 'Payment successful', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};