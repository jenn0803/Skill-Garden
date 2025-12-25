import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const contactSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  email: { type: String },
  subject: { type: String },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Answered', 'Closed'], default: 'Pending' },
  views: { type: Number, default: 0 },
createdAt: { type: Date, default: Date.now }

}, { timestamps: true });

export default model('ContactUs', contactSchema);
