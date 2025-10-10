import express from 'express';
import studentRoutes from './studentRoutes.js';
import teacherRoutes from './teacherRoutes.js';
import courseRoutes from './courseRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/courses', courseRoutes);
router.use('/auth', authRoutes);

export default router;