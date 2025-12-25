// server/routes/courseRoutes.js
import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesBySubcategory,
  incrementCourseViews,       // ⭐ NEW
  getMostViewedCourses        // ⭐ NEW
} from "../controllers/courseController.js";

const router = express.Router();

/* ------------------------------------------------
   COURSE CRUD ROUTES
--------------------------------------------------*/

// ✅ Create new course
router.post("/", createCourse);

// ✅ Get all courses
router.get("/", getCourses);

// ✅ Get single course by ID
router.get("/:id", getCourseById);

// ✅ Update course
router.put("/:id", updateCourse);

// ✅ Delete course
router.delete("/:id", deleteCourse);

// ✅ Get courses by subcategory (used in Home.jsx)
router.get("/subcategory/:subcategoryId", getCoursesBySubcategory);


/* ------------------------------------------------
   ANALYTICS ROUTES
--------------------------------------------------*/

// ⭐ Increase views (called when user opens a course)
router.put("/views/:id", incrementCourseViews);

// ⭐ Get top 10 most viewed courses
router.get("/analytics/most-viewed", getMostViewedCourses);


export default router;
