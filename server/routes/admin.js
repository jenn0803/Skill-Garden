import express from "express";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import User from "../models/User.js";

import jwt from "jsonwebtoken";

const router = express.Router();

/* =====================================================
   ADMIN AUTH MIDDLEWARE
===================================================== */
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

/* =====================================================
   CATEGORY ROUTES
===================================================== */
router.get("/category", verifyAdmin, async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.post("/category", verifyAdmin, async (req, res) => {
  const newCat = new Category(req.body);
  await newCat.save();
  res.json({ msg: "Category added", category: newCat });
});

router.put("/category/:id", verifyAdmin, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ msg: "Category updated", category: cat });
});

router.delete("/category/:id", verifyAdmin, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ msg: "Category deleted" });
});

/* =====================================================
   SUBCATEGORY ROUTES
===================================================== */
router.get("/subcategory", verifyAdmin, async (req, res) => {
  const subcats = await SubCategory.find().populate("category");
  res.json(subcats);
});

router.post("/subcategory", verifyAdmin, async (req, res) => {
  const sub = new SubCategory(req.body);
  await sub.save();
  res.json({ msg: "Subcategory added", sub });
});

router.put("/subcategory/:id", verifyAdmin, async (req, res) => {
  const sub = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ msg: "Subcategory updated", sub });
});

router.delete("/subcategory/:id", verifyAdmin, async (req, res) => {
  await SubCategory.findByIdAndDelete(req.params.id);
  res.json({ msg: "Subcategory deleted" });
});

/* =====================================================
   COURSE ROUTES
===================================================== */
router.get("/course", verifyAdmin, async (req, res) => {
  const courses = await Course.find().populate("subCategory");
  res.json(courses);
});

router.post("/course", verifyAdmin, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ msg: "Course added", course });
});

router.put("/course/:id", verifyAdmin, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ msg: "Course updated", course });
});

router.delete("/course/:id", verifyAdmin, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ msg: "Course deleted" });
});

/* =====================================================
   LESSON ROUTES
===================================================== */
router.get("/lesson", verifyAdmin, async (req, res) => {
  const lessons = await Lesson.find().populate("course");
  res.json(lessons);
});

router.post("/lesson", verifyAdmin, async (req, res) => {
  const lesson = new Lesson(req.body);
  await lesson.save();
  res.json({ msg: "Lesson added", lesson });
});

router.put("/lesson/:id", verifyAdmin, async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ msg: "Lesson updated", lesson });
});

router.delete("/lesson/:id", verifyAdmin, async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id);
  res.json({ msg: "Lesson deleted" });
});

// ======================
// ⭐ FULL ANALYTICS API
// ======================
router.get("/analytics", verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalSubCategories = await SubCategory.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();

    // Weekly Views (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        views: Math.floor(Math.random() * 80 + 20), // fake demo data
      };
    });

    // Most Viewed Courses (Top 5)
    const mostViewed = await Course.find()
      .sort({ views: -1 })
      .limit(5);

    // Last 5 Courses Added
    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalCategories,
      totalSubCategories,
      totalCourses,
      totalLessons,
      weeklyViews: last7Days,
      mostViewed,
      recentCourses,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


export default router;
