import express from 'express';
import { 
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialty,
  bookAppointment,
  getUserAppointments,
  cancelAppointment,
  payForAppointment,
  getAvailableSlots
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/specialty/:specialty', getDoctorsBySpecialty);
router.get('/:id', getDoctorById);
router.get('/:doctorId/slots/:date', getAvailableSlots);

// Protected routes
router.post('/:id/book', protect, bookAppointment);
router.get('/appointments/user', protect, getUserAppointments);
router.put('/appointments/:id/cancel', protect, cancelAppointment);
router.put('/appointments/:id/pay', protect, payForAppointment);

export default router;