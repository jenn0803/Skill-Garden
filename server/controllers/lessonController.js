import Lesson from '../models/Lesson.js';

// Get all lessons
export const getAllLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find().populate('courseId', 'title');
    res.json(lessons);
  } catch (err) {
    next(err);
  }
};


// ✅ Create Lesson
export const createLesson = async (req, res, next) => {
  try {
    const { courseId, title, order, videoUrl, quiz, resources } = req.body;
    if (!courseId || !title) return res.status(400).json({ message: 'courseId & title required' });
    const lesson = await Lesson.create({ courseId, title, order, videoUrl, quiz, resources });
    res.status(201).json(lesson);
  } catch (err) { next(err); }
};

// ✅ Get lessons by course
export const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId }).sort('order');
    res.json(lessons);
  } catch (err) { next(err); }
};

// ✅ Update lesson
export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { courseId, title, order, videoUrl, quiz, resources } = req.body;
    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { courseId, title, order, videoUrl, quiz, resources },
      { new: true }
    );
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) { next(err); }
};

// ✅ Delete lesson
export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ message: 'Lesson deleted' });
  } catch (err) { next(err); }
};


// ✅ Get single lesson by ID
export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id).populate("courseId", "title");

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    next(err);
  }
};
