import express from 'express';
import { 
  createAppointment, 
  getUserAppointments, 
  cancelAppointment,
  payForAppointment 
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/', protect, getUserAppointments);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/pay', protect, payForAppointment);

export default router;