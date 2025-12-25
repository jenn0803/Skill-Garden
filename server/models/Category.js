import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
  views: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

export default model('Category', categorySchema);
