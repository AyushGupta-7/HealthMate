import express from 'express';
import authUser from '../middleware/authUser.js';

const router = express.Router();

// All routes require authentication
router.use(authUser);

// Upload report
router.post("/upload", (req, res) => {
  res.json({ success: true, message: 'Report uploaded' });
});

// Get user reports
router.get("/", (req, res) => {
  res.json({ success: true, data: [] });
});

// Get report by ID
router.get("/:id", (req, res) => {
  res.json({ success: true, data: null });
});

// Delete report
router.delete("/:id", (req, res) => {
  res.json({ success: true, message: 'Report deleted' });
});

export default router;