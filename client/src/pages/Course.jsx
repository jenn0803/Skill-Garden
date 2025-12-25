// client/src/pages/Course.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Course() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // ✅ Use token from context and ensure reactive updates
  const { user, logout } = useContext(AuthContext);
  const token = localStorage.getItem("token");


  // Load courses from API
  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout(); // context logout updates token state
    navigate("/");
  };

  if (!courses.length)
    return <div style={{ padding: 20 }}>Loading courses...</div>;

  return (
    <div>
      {/* 🌈✨ NAVBAR */}
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
      <div style={{ maxWidth: 1000, margin: "28px auto", padding: 16 }}>
        <h1>All Courses</h1>
        <p style={{ color: "#555", marginBottom: 20 }}>
          Browse through all available courses.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {courses.map((course) => (
            <div
              key={course._id}
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
              }}
            >
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 10,
                    marginBottom: 14,
                  }}
                />
              )}

              <h2 style={{ marginBottom: 10, color: "#222" }}>{course.title}</h2>

              <p style={{ color: "#555", marginBottom: 12 }}>
                {course.description?.slice(0, 100)}...
              </p>

              <p style={{ color: "#777", fontSize: 14 }}>
                Level: <b>{course.level}</b>
              </p>

              <button
                style={{
                  marginTop: 12,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#8a2fff",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#6b1eff")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#8a2fff")}
                onClick={() => navigate(`/course/${course._id}`)}
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
