// server/controllers/notificationController.js
import Notification from "../models/Notification.js";

export const createLessonReminder = async (userId, lessonTitle) => {
  try {
    const message = `⏳ Don't forget to complete the lesson "${lessonTitle}"!`;

    const notification = await Notification.create({
      userId,
      message,
    });

    console.log("Notification created:", notification.message);
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// Fetch user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20); // latest 20 notifications
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.findByIdAndUpdate(notificationId, { read: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error marking notification as read" });
  }
};
