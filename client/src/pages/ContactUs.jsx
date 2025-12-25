import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/contactUs.css";

const ContactUs = ({ user }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/contact", {
        userId: user?._id,
        ...form,
      });

      if (res.data.success) {
        setSuccessMsg("🎉 Your message has been sent!");
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="contact-container">
      {/* NAVBAR */}
      <nav className="sg-navbar">
        <div className="sg-nav-left" onClick={() => navigate("/")}>
          <h2 className="sg-logo">🌱 SkillGarden</h2>
        </div>
      
        <div className="sg-nav-center">
          <Link to="/" className="sg-nav-link">Home</Link>
          <Link to="/categories" className="sg-nav-link">Categories</Link>
          <Link to="/courses" className="sg-nav-link">Courses</Link>
      
          {/* ⭐ NEW Contact Us Link */}
          <Link to="/contact-us" className="sg-nav-link">Contact Us</Link>
        </div>
      
        <div className="sg-nav-right">
          {token ? (
            <>
              <Link to="/profile" className="sg-nav-btn filled">Profile</Link>
              <button className="sg-nav-btn outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="sg-nav-btn filled">Login</Link>
          )}
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="contact-content">
        <div className="contact-card">
          <h2>📩 Contact Us</h2>
          <p>Have questions or suggestions? We'd love to hear from you!</p>

          {successMsg && <div className="success-msg">{successMsg}</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label>Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Subject of your message"
              />
            </div>

            <div>
              <label>Message</label>
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Write your message here..."
              />
            </div>

            <button type="submit">Send Message ✉️</button>
          </form>

          <p className="footer-note">
            We'll get back to you as soon as possible. 💜
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
