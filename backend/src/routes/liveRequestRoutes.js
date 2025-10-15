import express from 'express';
import {
  createLiveRequest,
  getAllLiveRequests,
  getLiveRequestById,
  updateLiveRequest,
  deleteLiveRequest,
  acceptLiveRequest,
  rejectLiveRequest,
  getLiveRequestsByStudent,
  getPendingLiveRequests
} from '../controllers/liveRequestController.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.get('/', getAllLiveRequests);
router.get('/pending', getPendingLiveRequests);
router.post('/', authorizeRoles('student'), createLiveRequest);
router.get('/:id', getLiveRequestById);
router.put('/:id', updateLiveRequest);
router.delete('/:id', deleteLiveRequest);
router.post('/:requestId/accept', authorizeRoles('teacher'), acceptLiveRequest);
router.post('/:requestId/reject', authorizeRoles('teacher'), rejectLiveRequest);
router.get('/student/:studentId', getLiveRequestsByStudent);

export default router;
