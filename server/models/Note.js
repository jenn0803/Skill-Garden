// server/models/Note.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const noteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  text: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

noteSchema.index({ userId: 1, lessonId: 1 }, { unique: true }); // one note per user+lesson

export default model("Note", noteSchema);
