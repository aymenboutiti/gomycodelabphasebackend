import express from 'express';
import { 
  createStudent, 
  updateStudent, 
  getStudentById, 
  getAllStudents, 
  deleteStudent,
  getStudentCourses,
  getStudentLiveRequests
} from '../controllers/studentController.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.get('/', authorizeRoles('teacher'), getAllStudents);
router.post('/', createStudent);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.get('/:id/courses', getStudentCourses);
router.get('/:id/live-requests', getStudentLiveRequests);

export default router;