import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const achievementSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  xpReward: { type: Number, default: 0 }
}, { timestamps: true });

export default model('Achievement', achievementSchema);
