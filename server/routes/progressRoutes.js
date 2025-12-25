import express from "express";
import {
  upsertProgress,
  getProgressForCourse,
  getUserProfileProgress,
  getProgressByUser,
  checkCourseCompletion
} from "../controllers/progressController.js";

const router = express.Router();

// Save or update lesson progress
router.post("/upsert", upsertProgress);

// Get progress for a course
router.get("/", getProgressForCourse);

// Get progress for profile page
router.get("/profile", getUserProfileProgress);

// Get all progress by user
router.get("/user/:userId", getProgressByUser);

// ✅ NEW ROUTE: Check if user completed entire course
router.get("/completion/:courseId/:userId", checkCourseCompletion);

export default router;
