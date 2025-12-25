// server/controllers/noteController.js
import Note from "../models/Note.js";
import mongoose from "mongoose";

/**
 * Upsert note for (userId, lessonId).
 * If note exists → update text + updatedAt
 * If not exists → create
 * Request body: { noteId?, userId, lessonId, text }
 */
export const upsertNote = async (req, res, next) => {
  try {
    const { noteId, userId, lessonId, text } = req.body;

    if (!userId || !lessonId) {
      return res.status(400).json({ message: "userId and lessonId are required" });
    }

    // If noteId provided, update that note (and ensure it belongs to user)
    if (noteId) {
      const note = await Note.findById(noteId);
      if (!note) return res.status(404).json({ message: "Note not found" });
      if (note.userId.toString() !== userId) {
        return res.status(403).json({ message: "Not allowed to update this note" });
      }

      note.text = text ?? note.text;
      note.updatedAt = new Date();
      await note.save();

      return res.json(note);
    }

    // Otherwise upsert by (userId, lessonId) - create new or update existing
    const filter = { userId: new mongoose.Types.ObjectId(userId), lessonId: new mongoose.Types.ObjectId(lessonId) };
    const update = { $set: { text: text ?? "", updatedAt: new Date(), createdAt: new Date() } };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const note = await Note.findOneAndUpdate(filter, update, options);
    return res.json(note);
  } catch (err) {
    console.error("NOTE UPSERT ERROR:", err);
    next(err);
  }
};

/**
 * Get note for a (userId, lessonId). Query params: userId, lessonId
 * Returns single note or null
 */
export const getUserLessonNote = async (req, res, next) => {
  try {
    const { userId, lessonId } = req.query;
    if (!userId || !lessonId) {
      return res.status(400).json({ message: "userId and lessonId query params required" });
    }

    const note = await Note.findOne({ userId, lessonId });
    return res.json(note || null);
  } catch (err) {
    console.error("GET NOTE ERROR:", err);
    next(err);
  }
};

/**
 * Delete note by id
 * Body or params should contain noteId and userId to verify owner
 */
export const deleteNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const { userId } = req.body;

    if (!noteId) return res.status(400).json({ message: "noteId required" });
    if (!userId) return res.status(400).json({ message: "userId required in body for verification" });

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not allowed to delete this note" });
    }

    await Note.findByIdAndDelete(noteId);
    return res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("DELETE NOTE ERROR:", err);
    next(err);
  }
};
