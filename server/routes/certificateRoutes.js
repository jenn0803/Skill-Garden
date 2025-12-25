import express from "express";
import { generateCertificate, getUserCertificates } from "../controllers/certificateController.js";

const router = express.Router();

// Generate certificate
router.post("/generate", generateCertificate);

// Fetch all certificates of a user
router.get("/", getUserCertificates);

export default router;
