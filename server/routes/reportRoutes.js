import express from 'express';
import { uploadReport, getUserReports, deleteReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/upload', protect, upload.single('report'), uploadReport);
router.get('/', protect, getUserReports);
router.delete('/:id', protect, deleteReport);

export default router;