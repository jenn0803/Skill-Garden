import React, { useState } from "react";
import axios from "axios";

export default function CourseChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userMessage = input;
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot", { message: userMessage });
      const answer = res.data.answer;

      setMessages((prev) => [...prev, { role: "bot", content: answer }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [...prev, { role: "bot", content: "Oops! Something went wrong." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🤖 Course Advisor Chatbot</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#4B0082" : "#D3D3D3",
              color: msg.role === "user" ? "white" : "black",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ask me which course to take..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

// Simple inline styles (you can move to CSS file)
const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    height: "400px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "10px",
    backgroundColor: "#f9f9f9",
  },
  message: {
    padding: "10px 15px",
    borderRadius: "15px",
    maxWidth: "80%",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4B0082",
    color: "white",
    cursor: "pointer",
  },
};
