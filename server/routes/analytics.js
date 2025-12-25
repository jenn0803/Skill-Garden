const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const LessonView = require("../models/LessonView"); // <- if you store views
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");

// --------------------------------------
// GET WEEKLY ANALYTICS
// --------------------------------------
router.get("/analytics/weekly", auth, adminOnly, async (req, res) => {
  try {
    const analytics = await LessonView.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%U", date: "$viewedAt" }
          },
          totalViews: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// --------------------------------------
// GET MOST VIEWED COURSE
// --------------------------------------
router.get("/analytics/top-course", auth, adminOnly, async (req, res) => {
  try {
    const course = await Course.findOne().sort({ views: -1 });

    res.json(course);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

module.exports = router;
