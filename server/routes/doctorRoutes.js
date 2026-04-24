import express from 'express';
import { 
    getAllDoctors,
    getDoctorById,
    getDoctorsBySpecialty,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    updateDoctorAvailability,
    getDoctorAvailability
} from '../controllers/doctorController.js';
import authUser from '../middleware/authUser.js';
import adminAuth from '../middleware/adminmiddleware.js';

const router = express.Router();

// Public Routes
router.get("/", getAllDoctors);
router.get("/specialty/:specialty", getDoctorsBySpecialty);
router.get("/:id", getDoctorById);
router.get("/:id/availability/:date", getDoctorAvailability);

// Admin Routes
router.post("/", authUser, adminAuth, addDoctor);
router.put("/:id", authUser, adminAuth, updateDoctor);
router.delete("/:id", authUser, adminAuth, deleteDoctor);
router.put("/:id/availability", authUser, adminAuth, updateDoctorAvailability);

export default router;