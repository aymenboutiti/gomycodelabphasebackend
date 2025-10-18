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
router.post('/', authorizeRoles('teacher'), (req, res, next) => {
  // Only use multer middleware if the request has a file (PDF courses)
  if (req.body.type === 'pdf') {
    return upload.single('pdfFile')(req, res, next);
  }
  // For video courses, just continue without multer
  next();
}, createCourse);
router.get('/:id', getCourseById);
router.put('/:id', authorizeRoles('teacher'), updateCourse);
router.delete('/:id', authorizeRoles('teacher'), deleteCourse);
router.post('/:courseId/enroll/:studentId', enrollStudent);
router.post('/:courseId/rate', rateCourse);

export default router;