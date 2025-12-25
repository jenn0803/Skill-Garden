import express from "express";
import PDFDocument from "pdfkit";
import Note from "../models/Note.js";

const router = express.Router();

router.get("/pdf", async (req, res) => {
  try {
    const { noteId } = req.query;

    if (!noteId) {
      return res.status(400).json({ error: "noteId is required" });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Set PDF headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=note.pdf");

    const doc = new PDFDocument();

    // Pipe PDF to response
    doc.pipe(res);

    // PDF Content
    doc.fontSize(22).text("Lesson Notes", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(note.text || "No notes added");

    // End PDF
    doc.end();

  } catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

export default router;
