import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

/* =====================================================
   CREATE COURSE
===================================================== */
export const createCourse = async (req, res, next) => {
  try {
    const { subcategoryId, title, description, level, duration } = req.body;

    if (!subcategoryId || !title)
      return res.status(400).json({ message: 'subcategoryId & title required' });

    const course = await Course.create({
      subcategoryId,
      title,
      description,
      level,
      duration
    });

    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET ALL COURSES
===================================================== */
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('subcategoryId');
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET SINGLE COURSE
===================================================== */
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("subcategoryId")
      .populate("lessons");   // ⭐ ADD THIS LINE

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    next(err);
  }
};


/* =====================================================
   UPDATE COURSE
===================================================== */
export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subcategoryId, title, description, level, duration } = req.body;

    const course = await Course.findByIdAndUpdate(
      id,
      { subcategoryId, title, description, level, duration },
      { new: true, runValidators: true }
    );

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json(course);
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   DELETE COURSE
===================================================== */
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET COURSES BY SUBCATEGORY
===================================================== */
export const getCoursesBySubcategory = async (req, res, next) => {
  try {
    const { subcategoryId } = req.params;

    const courses = await Course.find({ subcategoryId }).populate("subcategoryId");

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this subcategory" });
    }

    res.json(courses);
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   ⭐ INCREMENT COURSE VIEWS
===================================================== */
export const incrementCourseViews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   ⭐ GET MOST VIEWED COURSES (Analytics)
===================================================== */
export const getMostViewedCourses = async (req, res, next) => {
  try {
    const topCourses = await Course.find()
      .sort({ views: -1 })
      .limit(10); // TOP 10

    res.json(topCourses);
  } catch (err) {
    next(err);
  }
};
