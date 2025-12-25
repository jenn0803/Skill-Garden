import express from 'express';
import {
  createLesson,
  getAllLessons,
  getLessonsByCourse,
  getLessonById, // ✅ ADD THIS
  updateLesson,
  deleteLesson
} from '../controllers/lessonController.js';

const router = express.Router();

// CRUD routes
router.get('/', getAllLessons);
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById); // ✅ ADD THIS ROUTE
router.post('/', createLesson);
router.put('/:id', updateLesson);
router.delete('/:id', deleteLesson);

export default router;
