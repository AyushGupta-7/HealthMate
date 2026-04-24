import express from 'express';
import authUser from '../middleware/authUser.js';

const router = express.Router();

// All routes require authentication
router.use(authUser);

// Get current vitals
router.get("/current", (req, res) => {
  res.json({ success: true, data: {} });
});

// Update current vitals
router.put("/current", (req, res) => {
  res.json({ success: true, message: 'Vitals updated' });
});

// Get vitals history
router.get("/history", (req, res) => {
  res.json({ success: true, data: [] });
});

// Add vitals to history
router.post("/history", (req, res) => {
  res.json({ success: true, message: 'Vitals added to history' });
});

// Delete vitals entry
router.delete("/history/:id", (req, res) => {
  res.json({ success: true, message: 'Vitals entry deleted' });
});

export default router;