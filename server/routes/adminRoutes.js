import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getAdminStats, 
  getAllDoctors, 
  addDoctor, 
  deleteDoctor,
  setUnavailableSlots,
  setAvailableSlots,
  setFullDayUnavailable,
  setFullDayAvailable,
  getDoctorAvailability,
  cleanupPastDates,
  toggleDoctorAvailability
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);

// Dashboard stats
router.get('/stats', getAdminStats);

// Doctor management
router.get('/doctors', getAllDoctors);
router.post('/doctors', addDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Doctor availability
router.post('/doctors/:id/slots/unavailable', setUnavailableSlots);
router.post('/doctors/:id/slots/available', setAvailableSlots);
router.post('/doctors/:id/slots/full-day-unavailable', setFullDayUnavailable);
router.post('/doctors/:id/slots/full-day-available', setFullDayAvailable);
router.get('/doctors/:id/availability/:date', getDoctorAvailability);
router.patch('/doctors/:id/toggle-availability', toggleDoctorAvailability);

// Cleanup
router.post('/cleanup', cleanupPastDates);

export default router;