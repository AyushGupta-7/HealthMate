import express from 'express';
import { getCurrentVitals, updateCurrentVitals, addVitalsHistory, getVitalsHistory, deleteVitalsEntry } from '../controllers/vitalsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/current', protect, getCurrentVitals);
router.put('/current', protect, updateCurrentVitals);
router.post('/history', protect, addVitalsHistory);
router.get('/history', protect, getVitalsHistory);
router.delete('/history/:id', protect, deleteVitalsEntry);

export default router;