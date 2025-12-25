import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const courseSchema = new Schema({
  subcategoryId: { type: Types.ObjectId, ref: 'Subcategory', required: true },
  title: { type: String, required: true },
  description: { type: String },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  lessons: [{ type: Types.ObjectId, ref: 'Lesson' }],
  certificateAvailable: { type: Boolean, default: false },
  thumbnail: { type: String },
  duration: { type: String },
  createdBy: { type: Types.ObjectId, ref: 'User' },

  // ⭐ NEW FIELD
  views: { type: Number, default: 0 }

}, { timestamps: true });

export default model('Course', courseSchema);
