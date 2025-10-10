import express from 'express';
import {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  getAllStudents
} from '../controllers/studentController.js';

const router = express.Router();

router.post('/', createStudent);
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.get('/', getAllStudents);

export default router;