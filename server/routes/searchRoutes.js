import express from "express";
import Category from "../models/Category.js";
import Subcategory from "../models/SubCategory.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ categories: [], subcategories: [], courses: [], lessons: [] });

  try {
    const query = { $regex: q, $options: "i" };

    const categories = await Category.find({ name: query });
    const subcategories = await Subcategory.find({ name: query });
    const courses = await Course.find({ $or: [{ title: query }, { description: query }] });
    const lessons = await Lesson.find({ $or: [{ title: query }, { content: query }] });

    res.json({ categories, subcategories, courses, lessons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
