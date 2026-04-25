import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';

// @desc    Get admin dashboard statistics
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
    
    // Calculate revenue from completed appointments
    const completedApps = await Appointment.find({ status: 'completed' });
    const revenue = completedApps.reduce((sum, apt) => sum + (apt.fee || 0), 0);
    
    // Recent appointments
    const recentAppointments = await Appointment.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Recent users
    const recentUsers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,
        revenue,
        recentAppointments,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all doctors for admin
export const getAllDoctorsAdmin = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new doctor
export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, image, speciality, degree, experience, about, fees, address } = req.body;
    
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor already exists with this email' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const doctor = await Doctor.create({
      name, email, password: hashedPassword, image, speciality,
      degree, experience, about, fees,
      address: address || { line1: '', line2: '', city: '', state: '', pincode: '' }
    });
    
    res.status(201).json({ success: true, data: doctor, message: 'Doctor added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle doctor availability (available/unavailable)
export const toggleDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    
    doctor.available = req.body.available !== undefined ? req.body.available : !doctor.available;
    await doctor.save();
    
    res.json({ success: true, data: doctor, message: `Doctor is now ${doctor.available ? 'available' : 'unavailable'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update doctor availability for specific date and time slots
export const updateDoctorAvailability = async (req, res) => {
  try {
    const { date, slots, isAvailable } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    
    const dateKey = new Date(date).toDateString();
    
    if (!doctor.slots_booked[dateKey]) {
      doctor.slots_booked[dateKey] = [];
    }
    
    if (isAvailable === false) {
      // Mark slots as unavailable (add to booked slots)
      slots.forEach(slot => {
        if (!doctor.slots_booked[dateKey].includes(slot)) {
          doctor.slots_booked[dateKey].push(slot);
        }
      });
    } else {
      // Mark slots as available (remove from booked slots)
      slots.forEach(slot => {
        doctor.slots_booked[dateKey] = doctor.slots_booked[dateKey].filter(s => s !== slot);
      });
      
      // Clean up empty date entries
      if (doctor.slots_booked[dateKey].length === 0) {
        delete doctor.slots_booked[dateKey];
      }
    }
    
    await doctor.save();
    res.json({ success: true, data: doctor, message: 'Availability updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get doctor availability for a specific date
export const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    
    const dateKey = new Date(req.params.date).toDateString();
    const bookedSlots = doctor.slots_booked[dateKey] || [];
    
    res.json({ success: true, data: { bookedSlots, available: doctor.available } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};