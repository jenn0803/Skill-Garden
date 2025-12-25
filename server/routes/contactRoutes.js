// routes/contactRoutes.js
import express from "express";
import { createContact, getContacts, getUserContacts } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);              // User submits contact form
router.get("/", getContacts);                 // Admin gets list
router.get("/:userId", getUserContacts);      // Fetch specific user's messages

export default router;
