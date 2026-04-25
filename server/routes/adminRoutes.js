import express from 'express';
import { 
  getAdminStats, 
  getAllDoctorsAdmin, 
  addDoctor, 
  deleteDoctor,
  toggleDoctorAvailability,
  updateDoctorAvailability,
  getDoctorAvailability,
  getAllUsers, 
  getAllAppointments 
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(isAdmin);

router.get('/stats', getAdminStats);
router.get('/doctors', getAllDoctorsAdmin);
router.post('/doctors', addDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.put('/doctors/:id/availability', toggleDoctorAvailability);
router.put('/doctors/:id/slots', updateDoctorAvailability);
router.get('/doctors/:id/availability/:date', getDoctorAvailability);
router.get('/users', getAllUsers);
router.get('/appointments', getAllAppointments);

export default router;