import express from 'express';
import { 
  uploadReport, 
  getUserReports, 
  getReportById,
  deleteReport, 
  analyzeReport,
  getAIInsights,
  downloadReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/upload', protect, upload.single('report'), uploadReport);
router.get('/', protect, getUserReports);
router.get('/insights/ai', protect, getAIInsights);
router.get('/:id', protect, getReportById);
router.get('/:id/download', protect, downloadReport);
router.post('/:id/analyze', protect, analyzeReport);
router.delete('/:id', protect, deleteReport);

export default router;