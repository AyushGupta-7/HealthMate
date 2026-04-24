import Doctor from '../models/Doctor.js';
import bcrypt from 'bcryptjs';

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select('-password');
        res.json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-password');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctors by specialty
// @route   GET /api/doctors/specialty/:specialty
// @access  Public
export const getDoctorsBySpecialty = async (req, res) => {
    try {
        const doctors = await Doctor.find({ 
            speciality: req.params.specialty 
        }).select('-password');
        res.json({ success: true, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add new doctor (Admin only)
// @route   POST /api/doctors
// @access  Private/Admin
export const addDoctor = async (req, res) => {
    try {
        const { name, email, password, image, speciality, degree, experience, about, fees, address } = req.body;
        
        // Check if doctor already exists
        const doctorExists = await Doctor.findOne({ email });
        if (doctorExists) {
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
            address
        });
        
        res.status(201).json({ 
            success: true, 
            data: doctor,
            message: 'Doctor added successfully' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update doctor (Admin only)
// @route   PUT /api/doctors/:id
// @access  Private/Admin
export const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        
        const { name, image, speciality, degree, experience, about, fees, address, available } = req.body;
        
        doctor.name = name || doctor.name;
        doctor.image = image || doctor.image;
        doctor.speciality = speciality || doctor.speciality;
        doctor.degree = degree || doctor.degree;
        doctor.experience = experience || doctor.experience;
        doctor.about = about || doctor.about;
        doctor.fees = fees || doctor.fees;
        doctor.address = address || doctor.address;
        doctor.available = available !== undefined ? available : doctor.available;
        
        await doctor.save();
        
        res.json({ success: true, data: doctor, message: 'Doctor updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete doctor (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
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

// @desc    Update doctor availability slots
// @route   PUT /api/doctors/:id/availability
// @access  Private/Admin
export const updateDoctorAvailability = async (req, res) => {
    try {
        const { date, slots } = req.body;
        const doctor = await Doctor.findById(req.params.id);
        
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        
        const dateKey = new Date(date).toDateString();
        
        if (!doctor.slots_booked[dateKey]) {
            doctor.slots_booked[dateKey] = [];
        }
        
        // Update slots (remove or add)
        slots.forEach(slot => {
            const index = doctor.slots_booked[dateKey].indexOf(slot.time);
            if (slot.isAvailable && index !== -1) {
                doctor.slots_booked[dateKey].splice(index, 1);
            } else if (!slot.isAvailable && index === -1) {
                doctor.slots_booked[dateKey].push(slot.time);
            }
        });
        
        await doctor.save();
        
        res.json({ success: true, message: 'Availability updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctor availability for a date
// @route   GET /api/doctors/:id/availability/:date
// @access  Public
export const getDoctorAvailability = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        
        const dateKey = new Date(req.params.date).toDateString();
        const bookedSlots = doctor.slots_booked[dateKey] || [];
        
        res.json({ success: true, data: { bookedSlots } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};