// server/routes/noteRoutes.js
import express from "express";
import { upsertNote, getUserLessonNote, deleteNote } from "../controllers/noteController.js";

const router = express.Router();

// Upsert note (create or update)
router.post("/upsert", upsertNote);

// Get note by user + lesson
// GET /api/notes/user-lesson?userId=...&lessonId=...
router.get("/user-lesson", getUserLessonNote);

// Delete note by id
router.delete("/:id", deleteNote);

export default router;
