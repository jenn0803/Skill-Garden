import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const activitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  activityType: { type: String },
  pointsEarned: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  meta: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default model('Activity', activitySchema);
