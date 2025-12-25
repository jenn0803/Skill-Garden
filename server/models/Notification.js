// server/models/Notification.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default model("Notification", notificationSchema);
