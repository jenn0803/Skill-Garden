// server/controllers/progressController.js
import mongoose from "mongoose";
import Progress from "../models/Progress.js";
import Lesson from "../models/Lesson.js";
import CourseProgress from "../models/CourseProgress.js";
import { generateCertificate } from "./certificateController.js";
import { createLessonReminder } from "./notificationController.js"; // ✅ NEW

export const upsertProgress = async (req, res, next) => {
  try {
    const { userId, courseId, lessonId, completed, videoWatchedPercent } = req.body;

    if (!userId || !courseId || !lessonId) {
      return res.status(400).json({ message: "userId, courseId & lessonId required" });
    }

    const safePercent = Number(videoWatchedPercent) || 0;

    const isCompleted =
      completed !== undefined && completed !== null
        ? completed
        : safePercent >= 95;

    const updateData = {
      userId,
      courseId,
      lessonId,
      videoWatchedPercent: safePercent,
      completed: isCompleted,
      completedAt: isCompleted ? new Date() : null,
      lastUpdated: new Date(),
      viewedCourse: true,
    };

    // ----------------------
    // Update lesson progress
    // ----------------------
    const updatedProgress = await Progress.findOneAndUpdate(
      { userId, courseId, lessonId },
      { $set: updateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // ----------------------
    // Send notification if lesson is partially completed
    // ----------------------
    if (!updatedProgress.completed) {
      const lesson = await Lesson.findById(lessonId); // get lesson title
      await createLessonReminder(userId, lesson.title);
    }

    // --------------------------------------------
    // CHECK COURSE COMPLETION
    // --------------------------------------------
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedLessons = await Progress.countDocuments({
      userId,
      courseId,
      completed: true,
    });

    let certificate = null;

    if (completedLessons === totalLessons && totalLessons > 0) {
      // Mark course complete
      const courseProgress = await CourseProgress.findOneAndUpdate(
        { userId, courseId },
        {
          $set: {
            completed: true,
            completedAt: new Date(),
            certificateAvailable: true,
          },
        },
        { upsert: true, new: true }
      );

      // Generate certificate ONLY if not already generated
      if (!courseProgress.certificateUrl) {
        const cert = await generateCertificate(userId, courseId);

        await CourseProgress.findOneAndUpdate(
          { userId, courseId },
          { $set: { certificateUrl: cert.certificateUrl } }
        );

        certificate = cert;
      } else {
        certificate = { url: courseProgress.certificateUrl };
      }
    }

    res.json({
      message: "Progress updated successfully",
      progress: updatedProgress,
      courseCompleted: completedLessons === totalLessons,
      certificate,
    });

  } catch (err) {
    console.error("❌ upsertProgress ERROR:", err);
    next(err);
  }
};


// --------------------------------------------
// GET PROGRESS FOR A COURSE
// --------------------------------------------

export const getProgressForCourse = async (req, res, next) => {
  try {
    const { userId, courseId } = req.query;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "userId & courseId required" });
    }

    const rows = await Progress.find({ userId, courseId })
      .populate("lessonId", "title order");

    res.json(rows);

  } catch (err) {
    next(err);
  }
};

// --------------------------------------------
// CHECK COURSE COMPLETION
// --------------------------------------------

export const checkCourseCompletion = async (req, res, next) => {
  try {
    const { courseId, userId } = req.params;

    const lessons = await Lesson.find({ courseId });
    const completedLessons = await Progress.countDocuments({
      userId,
      courseId,
      completed: true,
    });

    res.json({
      isCompleted: lessons.length > 0 && completedLessons === lessons.length,
      totalLessons: lessons.length,
      completedLessons,
    });

  } catch (err) {
    next(err);
  }
};

// --------------------------------------------
// PROFILE PROGRESS
// --------------------------------------------

export const getUserProfileProgress = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "userId required" });

    const progress = await Progress.find({ userId })
      .populate("courseId", "title thumbnail description")
      .populate("lessonId", "title order");

    const viewedCourses = [];
    const completedLessons = [];
    const courseProgress = {};

    progress.forEach((p) => {
      if (p.courseId && !viewedCourses.some(c => c._id.equals(p.courseId._id))) {
        viewedCourses.push(p.courseId);
      }

      const percent = p.videoWatchedPercent || 0;
      courseProgress[p.courseId._id] = Math.max(courseProgress[p.courseId._id] || 0, percent);

      if (p.completed && p.lessonId) {
        completedLessons.push({
          ...p.lessonId.toObject(),
          courseTitle: p.courseId.title,
        });
      }
    });

    res.json({
      viewedCourses,
      completedLessons,
      totalCompletedLessons: completedLessons.length,
      courseProgress: Object.keys(courseProgress).map((id) => ({
        courseId: id,
        percent: courseProgress[id],
      })),
    });

  } catch (err) {
    next(err);
  }
};

// --------------------------------------------
// GET PROGRESS BY USER
// --------------------------------------------

export const getProgressByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const progress = await Progress.find({ userId })
      .populate("courseId")
      .populate("lessonId");

    res.json(progress);

  } catch (err) {
    next(err);
  }
};
