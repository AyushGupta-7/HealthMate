import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';

// Get admin dashboard statistics
export const getAdminStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });
    
    res.json({
      success: true,
      data: {
        totalDoctors,
        totalUsers,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new doctor
export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, image, speciality, degree, experience, about, fees, address } = req.body;
    
    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Doctor already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      image,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: address || { line1: '', line2: '', city: '', state: '', pincode: '' }
    });
    
    res.status(201).json({ success: true, data: doctor, message: 'Doctor added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const setUnavailableSlots = async (req, res) => {
  try {
    const { date, slots } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Use the same date format for consistency
    const inputDate = new Date(date);
    const dateKey = inputDate.toDateString();
    
    console.log('Setting unavailable slots - Input date:', date);
    console.log('Generated dateKey:', dateKey);
    console.log('Slots to mark unavailable:', slots);
    
    if (!doctor.slots_booked[dateKey]) {
      doctor.slots_booked[dateKey] = [];
    }
    
    // Add slots to unavailable list
    slots.forEach(slot => {
      if (!doctor.slots_booked[dateKey].includes(slot)) {
        doctor.slots_booked[dateKey].push(slot);
      }
    });
    
    await doctor.save();
    
    console.log('Updated slots_booked:', doctor.slots_booked);
    
    res.json({ success: true, message: `${slots.length} slot(s) marked as unavailable` });
  } catch (error) {
    console.error('Error in setUnavailableSlots:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Set specific time slots as available
export const setAvailableSlots = async (req, res) => {
  try {
    const { date, slots } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const dateKey = new Date(date).toDateString();
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    if (selectedDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot modify past dates' 
      });
    }
    
    if (doctor.slots_booked[dateKey]) {
      slots.forEach(slot => {
        doctor.slots_booked[dateKey] = doctor.slots_booked[dateKey].filter(s => s !== slot);
      });
      
      if (doctor.slots_booked[dateKey].length === 0) {
        delete doctor.slots_booked[dateKey];
      }
    }
    
    await doctor.save();
    res.json({ success: true, message: `${slots.length} slot(s) marked as available` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Set full day as unavailable
export const setFullDayUnavailable = async (req, res) => {
  try {
    const { date } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot modify past dates' 
      });
    }
    
    const timeSlots = [
      "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
      "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
      "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ];
    
    const dateKey = new Date(date).toDateString();
    doctor.slots_booked[dateKey] = timeSlots;
    
    await doctor.save();
    res.json({ success: true, message: 'Full day marked as unavailable' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Set full day as available
export const setFullDayAvailable = async (req, res) => {
  try {
    const { date } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot modify past dates' 
      });
    }
    
    const dateKey = new Date(date).toDateString();
    delete doctor.slots_booked[dateKey];
    
    await doctor.save();
    res.json({ success: true, message: 'Full day marked as available' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get doctor availability for a specific date (already have this)
export const getDoctorAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const dateKey = new Date(req.params.date).toDateString();
    const bookedSlots = doctor.slots_booked[dateKey] || [];
    
    // Also return all time slots for debugging
    const allSlots = [
      "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
      "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
      "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ];
    
    res.json({ 
      success: true, 
      data: { 
        bookedSlots,
        allSlots,
        available: doctor.available 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Auto cleanup endpoint (can be called periodically)
export const cleanupPastDates = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    let cleanedCount = 0;
    
    for (const doctor of doctors) {
      const cleaned = await doctor.cleanupPastDates();
      if (cleaned) cleanedCount++;
    }
    
    res.json({ 
      success: true, 
      message: `Cleaned past dates for ${cleanedCount} doctors` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Toggle doctor overall availability
export const toggleDoctorAvailability = async (req, res) => {
  try {
    const { available } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    doctor.available = available !== undefined ? available : !doctor.available;
    await doctor.save();
    
    res.json({ 
      success: true, 
      data: doctor,
      message: `Doctor is now ${doctor.available ? 'available' : 'unavailable'}` 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


