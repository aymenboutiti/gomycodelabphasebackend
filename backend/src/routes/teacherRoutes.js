import express from 'express';
import { 
  createTeacher, 
  getAllTeachers, 
  getTeacherById, 
  updateTeacher, 
  deleteTeacher,
  getTeacherCourses,
  getLiveRequestsForTeacher,
  acceptLiveRequest
} from '../controllers/teacherController.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.get('/', authorizeRoles('student'), getAllTeachers);
router.post('/', createTeacher);
router.get('/:id', getTeacherById);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);
router.get('/:id/courses', getTeacherCourses);
router.get('/live-requests', authorizeRoles('teacher'), getLiveRequestsForTeacher);
router.post('/live-requests/:requestId/accept', authorizeRoles('teacher'), acceptLiveRequest);

export default router;