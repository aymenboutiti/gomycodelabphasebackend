import express from 'express';
import { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse,
  enrollStudent,
  rateCourse,
  upload
} from '../controllers/courseController.js';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

router.get('/', getAllCourses);
router.post('/', authorizeRoles('teacher'), upload.single('pdfFile'), createCourse);
router.get('/:id', getCourseById);
router.put('/:id', authorizeRoles('teacher'), updateCourse);
router.delete('/:id', authorizeRoles('teacher'), deleteCourse);
router.post('/:courseId/enroll/:studentId', enrollStudent);
router.post('/:courseId/rate', rateCourse);

export default router;