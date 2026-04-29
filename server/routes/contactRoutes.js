import express from 'express';
import {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  addAdminNotes,
  deleteContact,
  getContactsByStatus,
  getPendingCount,
  bulkUpdateStatus
} from '../controllers/contactController.js';

const router = express.Router();

// Public routes
router.post('/', submitContactForm);

// Admin routes (add authentication middleware in production)
router.get('/all', getAllContacts);
router.get('/pending/count', getPendingCount);
router.get('/status/:status', getContactsByStatus);
router.get('/:id', getContactById);
router.put('/:id/status', updateContactStatus);
router.post('/:id/notes', addAdminNotes);
router.delete('/:id', deleteContact);
router.put('/bulk/status', bulkUpdateStatus);

export default router;