import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const quizQuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctIndex: { type: Number }
});

const lessonSchema = new Schema({
  courseId: { type: Types.ObjectId, ref: 'Course', required: true },

  title: { type: String, required: true },
  order: { type: Number, default: 0 },

  // 🆕 YouTube URL
  videoUrl: { type: String },

  // 🆕 Uploaded video file
  videoFile: { type: String }, // Example: /uploads/lesson1.mp4

  quiz: [quizQuestionSchema],
  resources: [{ type: String }],
  views: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });


// 🛑 Custom validation → Require at least one video source
lessonSchema.pre('validate', function (next) {
  if (!this.videoUrl && !this.videoFile) {
    return next(new Error("Either videoUrl or videoFile is required"));
  }
  next();
});

export default model('Lesson', lessonSchema);
