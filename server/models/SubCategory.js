import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const subcategorySchema = new Schema({
  categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String },
  views: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

export default model('Subcategory', subcategorySchema);
