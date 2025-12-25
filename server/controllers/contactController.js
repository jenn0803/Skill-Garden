// controllers/contactController.js
import ContactUs from "../models/ContactUs.js";
import mongoose from "mongoose";

// ➤ Create a new Contact Message
export const createContact = async (req, res) => {
  try {
    const { userId, name, email, subject, message } = req.body;

    const newContact = await ContactUs.create({
      userId: userId ? mongoose.Types.ObjectId(userId) : null,
      name,
      email,
      subject,
      message
    });

    res.json({
      success: true,
      message: "Your message has been submitted!",
      data: newContact
    });
  } catch (err) {
    console.error("Contact Error:", err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// ➤ Fetch all contacts for admin
export const getContacts = async (req, res) => {
  try {
    const contacts = await ContactUs.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

// ➤ Fetch user-wise messages
export const getUserContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    const contacts = await ContactUs.find({ userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
