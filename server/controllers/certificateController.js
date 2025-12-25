// server/controllers/certificateController.js
import Certificate from "../models/Certificate.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import mongoose from "mongoose";

export const generateCertificate = async (userId, courseId) => {
  try {
    if (!userId || !courseId) return null;

    // 1️⃣ Check if certificate already exists
    const existingCert = await Certificate.findOne({ userId, courseId });
    if (existingCert) return existingCert;

    // 2️⃣ Get course info
    const course = await Course.findById(courseId);
    if (!course) return null;

    // 3️⃣ Get user info
    const user = await User.findById(userId);
    if (!user) return null;

    // 4️⃣ Count total lessons and completed lessons
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedLessons = await Progress.countDocuments({
      userId,
      courseId,
      completed: true,
    });

    console.log("CERTIFICATE DEBUG:", {
      userId,
      courseId,
      totalLessons,
      completedLessons,
    });

    // If course not fully completed → do NOT generate certificate
    if (completedLessons < totalLessons || totalLessons === 0) {
      console.log("❌ Certificate not generated: course not fully completed.");
      return null;
    }

    // 5️⃣ Generate PDF
    const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 50 });
    const certDir = path.join("certificates");
    fs.mkdirSync(certDir, { recursive: true });

    const certFileName = `certificate_${userId}_${courseId}_${Date.now()}.pdf`;
    const certPath = path.join(certDir, certFileName);
    const writeStream = fs.createWriteStream(certPath);
    doc.pipe(writeStream);

    // Background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fdf6e3"); // light cream background

    // Certificate Title
  doc
  .fontSize(48)
  .fillColor("#4B0082")
  .font("Helvetica-Bold")
  .text("Certificate of Completion", { align: "center" }) // removed 🎉
  .moveDown(2);


    // Awarded to
    doc
      .fontSize(22)
      .fillColor("#000")
      .font("Helvetica")
      .text("This certificate is proudly awarded to", { align: "center" })
      .moveDown(0.5);

    // User Name
    doc
      .fontSize(36)
      .fillColor("#1B5E20")
      .font("Helvetica-Bold")
      .text(user.name, { align: "center" })
      .moveDown(1);

    // Course completion text
    doc
      .fontSize(22)
      .fillColor("#000")
      .font("Helvetica")
      .text("for successfully completing the course", { align: "center" })
      .moveDown(0.5);

    // Course Title
    doc
      .fontSize(28)
      .fillColor("#0D47A1")
      .font("Helvetica-Bold")
      .text(course.title, { align: "center" })
      .moveDown(2);

    // Issue date
    doc
      .fontSize(18)
      .fillColor("#555")
      .text(`Issued on: ${new Date().toLocaleDateString()}`, { align: "center" });

    // Decorative footer line
    doc
      .moveTo(100, doc.page.height - 80)
      .lineTo(doc.page.width - 100, doc.page.height - 80)
      .stroke("#6A1B9A");

    doc.end();

    // 6️⃣ Save certificate to database
    return new Promise((resolve, reject) => {
      writeStream.on("finish", async () => {
        try {
          const cert = await Certificate.create({
            userId: new mongoose.Types.ObjectId(userId),
            courseId: new mongoose.Types.ObjectId(courseId),
            certificateUrl: `http://localhost:5000/certificates/${certFileName}`,
            issuedAt: new Date(),
          });

          console.log("✅ Certificate saved:", cert);
          resolve(cert);
        } catch (err) {
          console.error("Error saving certificate to DB:", err);
          reject(err);
        }
      });

      writeStream.on("error", (err) => {
        console.error("Error writing PDF:", err);
        reject(err);
      });
    });

  } catch (err) {
    console.error("CERTIFICATE ERROR:", err);
    return null;
  }
};

// Fetch user certificates
export const getUserCertificates = async (req, res) => {
  try {
    const { userId } = req.query;
    const certificates = await Certificate.find({ userId })
      .populate("courseId", "title");

    return res.json({ certificates });
  } catch (err) {
    console.error("CERTIFICATE FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching certificates" });
  }
};
