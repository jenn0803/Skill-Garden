import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const certSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  certificateUrl: { type: String },
  issuedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }// new field
}, { timestamps: true });

export default model('Certificate', certSchema);
