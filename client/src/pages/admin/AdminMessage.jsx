import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHome, FaPlusCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import "../../styles/AdminMessage.css";



const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      if (res.data.success) setMessages(res.data.contacts);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ================= NAVBAR STYLES =================
  const navbar = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    marginBottom: 30,
    background: "linear-gradient(90deg, #5a189a, #9d4edd)",
    borderRadius: 15,
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 999,
  };

  const navLinks = {
    display: "flex",
    gap: 20,
    fontSize: 16,
    fontWeight: "600",
  };

  const navItem = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
  <div style={{ padding: 20 }}>
    {/* ================= NAVBAR ================= */}
    <div style={navbar}>
      <h2 style={{ margin: 0, fontSize: "22px" }}>⚡ Admin Panel</h2>

      <div style={navLinks}>
        {[
          { icon: <FaHome />, label: "Dashboard", link: "/admin/AdminDashboard" },
          { icon: <FaPlusCircle />, label: "Messages", link: "/admin/messages" },
          { icon: <FaPlusCircle />, label: "Category", link: "/admin/categories" },
          { icon: <FaPlusCircle />, label: "Subcategory", link: "/admin/subcategories" },
          { icon: <FaPlusCircle />, label: "Course", link: "/admin/courses" },
          { icon: <FaPlusCircle />, label: "Lesson", link: "/admin/lessons" },
        ].map((item, index) => (
          <motion.div
            key={index}
            style={navItem}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            onClick={() => (window.location.href = item.link)}
          >
            {item.icon} {item.label}
          </motion.div>
        ))}
      </div>
    </div>

    {/* ================= MESSAGES TABLE ================= */}
    <div className="msg-wrapper">
      <h1 className="msg-title">📩 User Messages</h1>

      {loading ? (
        <p className="loading">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="no-msg">No messages yet.</p>
      ) : (
        <div className="msg-card">
          <table className="msg-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User Info</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Received</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((msg, index) => (
                <tr key={msg._id} className="msg-row">
                  <td>{index + 1}</td>

                  <td>
                    <strong>{msg.name}</strong>
                    <div className="email-text">{msg.email}</div>
                  </td>

                  <td>{msg.subject}</td>

                  <td>
                    <div className="msg-text">{msg.message}</div>
                  </td>

                  <td>
                    <span className={`status-badge ${msg.status.toLowerCase()}`}>
                      {msg.status}
                    </span>
                  </td>

                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
};
export default AdminMessages;
