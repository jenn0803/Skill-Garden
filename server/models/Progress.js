import mongoose from "mongoose";
const { Schema, model } = mongoose;

const progressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },

    // tracking video & quiz
    videoWatchedPercent: { type: Number, default: 0 },
    quizScore: { type: Number, default: 0 },
    quizTotal: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },

    // NEW → viewed course tracking
    viewedCourse: { type: Boolean, default: false },

    // NEW → completed lesson date
    completedAt: { type: Date, default: null },

    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ensure unique doc per user/course/lesson
progressSchema.index({ userId: 1, courseId: 1, lessonId: 1 }, { unique: true });

export default model("Progress", progressSchema);
