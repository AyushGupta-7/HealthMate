import express from 'express';
import { getAllDoctors, getDoctorById, getDoctorsBySpecialty} from '../controllers/doctorController.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/specialty/:specialty', getDoctorsBySpecialty);
router.get('/:id', getDoctorById);
// router.put('/:id/availability', updateDoctorAvailability);

export default router;