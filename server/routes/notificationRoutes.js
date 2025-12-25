// server/routes/notificationRoutes.js
import express from "express";
import { getUserNotifications, markAsRead } from "../controllers/notificationController.js";
const router = express.Router();

router.get("/", getUserNotifications);      // GET /api/notifications?userId=...
router.put("/read", markAsRead);           // PUT /api/notifications/read

export default router;
