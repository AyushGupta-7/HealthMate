import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

// Create appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, fee, doctorName, doctorSpecialty, doctorImage, doctorAddress } = req.body;
    
    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Check if doctor is available
    if (!doctor.available) {
      return res.status(400).json({ success: false, message: 'Doctor is currently unavailable' });
    }
    
    // Check if the specific time slot is available
    const isAvailable = doctor.isSlotAvailable(date, time);
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: 'This time slot is not available. Please select another time.' });
    }
    
    // Book the slot in doctor's schedule
    await doctor.bookSlot(date, time);
    
    // Create appointment
    const appointment = await Appointment.create({
      user: req.user._id,
      doctorId,
      doctorName,
      doctorSpecialty,
      doctorImage,
      doctorAddress,
      date,
      time,
      fee,
      status: 'pending'
    });
    
    res.status(201).json({ success: true, data: appointment, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Create appointment error:', error);
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
    
    // Free up the slot in doctor's schedule
    const doctor = await Doctor.findById(appointment.doctorId);
    if (doctor) {
      await doctor.freeSlot(appointment.date, appointment.time);
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
    
    appointment.status = 'paid';
    await appointment.save();
    
    res.json({ success: true, message: 'Payment successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};