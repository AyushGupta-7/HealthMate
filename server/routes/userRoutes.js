import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  updateProfileImage, 
  deleteProfileImage,
  deleteAccount 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/image', protect, upload.single('image'), updateProfileImage);
router.delete('/profile/image', protect, deleteProfileImage);
router.delete('/profile', protect, deleteAccount);

export default router;