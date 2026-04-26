import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    const upcomingAppointments = await Appointment.countDocuments({
      doctorId: doctor._id,
      date: { $gte: new Date().toISOString().split('T')[0] },
      status: { $ne: 'cancelled' }
    });
    
    const doctorData = doctor.toObject();
    doctorData.upcomingAppointments = upcomingAppointments;
    
    res.json({ success: true, data: doctorData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorsBySpecialty = async (req, res) => {
  try {
    const doctors = await Doctor.find({ 
      speciality: req.params.specialty,
      available: true 
    }).select('-password');
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to check if a slot is available
const isSlotAvailable = async (doctorId, date, time) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return false;
  if (!doctor.available) return false;
  
  const dateKey = new Date(date).toDateString();
  const bookedSlots = doctor.slots_booked[dateKey] || [];
  return !bookedSlots.includes(time);
};

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, fee, doctorName, doctorSpecialty, doctorImage, doctorAddress } = req.body;
    
    // Find the doctor first
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Check if doctor is available overall
    if (!doctor.available) {
      return res.status(400).json({ success: false, message: 'This doctor is currently not accepting appointments' });
    }
    
    // Check if the specific time slot is available
    const dateKey = new Date(date).toDateString();
    const bookedSlots = doctor.slots_booked[dateKey] || [];
    
    if (bookedSlots.includes(time)) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }
    
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
    
    // Book the slot
    if (!doctor.slots_booked[dateKey]) {
      doctor.slots_booked[dateKey] = [];
    }
    doctor.slots_booked[dateKey].push(time);
    await doctor.save();
    
    res.status(201).json({ success: true, data: appointment, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort({ createdAt: -1 });

    const appointmentsWithFlags = appointments.map(apt => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const canCancel = appointmentDate >= today && apt.status === 'pending';
      return { ...apt.toObject(), canCancel };
    });
    
    res.json({ success: true, data: appointmentsWithFlags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ success: false, message: 'Cannot cancel past appointments' });
    }
    
    // Free up the slot in doctor's schedule
    const doctor = await Doctor.findById(appointment.doctorId);
    if (doctor) {
      const dateKey = new Date(appointment.date).toDateString();
      if (doctor.slots_booked[dateKey]) {
        doctor.slots_booked[dateKey] = doctor.slots_booked[dateKey].filter(t => t !== appointment.time);
        if (doctor.slots_booked[dateKey].length === 0) {
          delete doctor.slots_booked[dateKey];
        }
        await doctor.save();
      }
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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


// Add this missing function - Get available slots for a doctor on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Create date key in the same format used when saving
    const inputDate = new Date(date);
    const dateKey = inputDate.toDateString();
    
    console.log('Input date:', date);
    console.log('Generated dateKey:', dateKey);
    console.log('All stored slots_booked:', doctor.slots_booked);
    
    // Get slots marked unavailable by admin
    const adminBlockedSlots = doctor.slots_booked[dateKey] || [];
    
    // Get slots already booked by users
    const bookedAppointments = await Appointment.find({
      doctorId: doctorId,
      date: date,
      status: { $nin: ['cancelled'] }
    });
    
    const bookedSlots = bookedAppointments.map(apt => apt.time);
    
    // Combine both
    const allUnavailableSlots = [...new Set([...adminBlockedSlots, ...bookedSlots])];
    
    console.log('Admin blocked slots:', adminBlockedSlots);
    console.log('Booked appointments:', bookedSlots);
    console.log('All unavailable slots:', allUnavailableSlots);
    
    const allSlots = [
      "10:30", "11:00", "11:30", "12:00", "12:30", "13:00",
      "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
      "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
    ];
    
    const availableSlots = allSlots.filter(slot => !allUnavailableSlots.includes(slot));
    
    res.json({ 
      success: true, 
      data: { 
        availableSlots,
        unavailableSlots: allUnavailableSlots,
        adminBlockedSlots,
        bookedSlots,
        dateKey,
        isDoctorAvailable: doctor.available 
      } 
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};