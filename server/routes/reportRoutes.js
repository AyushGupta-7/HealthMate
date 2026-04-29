import express from 'express';
import { 
  uploadReport, 
  getUserReports, 
  getReportById,
  deleteReport, 
  analyzeReport,
  downloadReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Upload report (with file)
router.post('/upload', protect, upload.single('report'), uploadReport);

// Get all user reports
router.get('/', protect, getUserReports);

// Get single report
router.get('/:id', protect, getReportById);

// Download report
router.get('/:id/download', protect, downloadReport);

// Analyze report
router.post('/:id/analyze', protect, analyzeReport);

// Delete report
router.delete('/:id', protect, deleteReport);

export default router;