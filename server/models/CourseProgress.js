import mongoose from "mongoose";

const CourseProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },

  certificateAvailable: { type: Boolean, default: false },
  certificateUrl: { type: String, default: null },
});

export default mongoose.model("CourseProgress", CourseProgressSchema);
