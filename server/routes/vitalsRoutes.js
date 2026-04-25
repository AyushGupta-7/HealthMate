import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getCurrentVitals,
  updateCurrentVitals,
  addVitalsHistory,
  getVitalsHistory,
  deleteVitalsEntry,
  getVitalsTrend,
  getVitalsStats
} from '../controllers/vitalsController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Current vitals routes
router.get('/current', getCurrentVitals);
router.put('/current', updateCurrentVitals);

// History routes
router.get('/history', getVitalsHistory);
router.post('/history', addVitalsHistory);
router.delete('/history/:id', deleteVitalsEntry);

// Analytics routes
router.get('/trend', getVitalsTrend);
router.get('/stats', getVitalsStats);

export default router;