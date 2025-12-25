// server/routes/chatbot.js
import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/", async (req, res) => { // ✅ just "/"
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ answer: response.data.choices[0].text });
  } catch (err) {
    console.error("Chatbot request error:", err.response?.data || err.message);
    res.status(500).json({ answer: "Something went wrong with Chatbot." });
  }
});

export default router;
