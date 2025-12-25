// client/src/pages/CoursePage.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/CoursePage.css";

export default function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  // Decode JWT user
  const getUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // 1️⃣ Increase Course Views
    api.put(`/courses/views/${id}`)
      .then(() => api.get(`/courses/${id}`))
      .then((res) => setCourse(res.data))
      .catch(console.error);

    // 2️⃣ Fetch Lessons
    api
      .get(`/lessons/course/${id}`)
      .then((res) => setLessons(res.data))
      .catch(console.error);

    // 3️⃣ Track Viewed Course
    const user = getUser();
    if (user) {
      api
        .post("/progress/upsert", {
          userId: user.id,
          courseId: id,
          lessonId: "000000000000000000000000", // dummy lesson
          viewedCourse: true,
        })
        .catch(console.error);
    }
  }, [id]);

  const handleLogout = () => logout();

  if (!course)
    return <div style={{ padding: 20 }}>Loading course...</div>;

  return (
    <>
      {/* Navbar */}
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

      {/* Main Content */}
      <div className="course-container">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <p><strong>Views:</strong> {course.views}</p>

        <h2>Lessons</h2>

        {lessons.length === 0 && <p>No lessons yet</p>}

        {lessons.map((lesson) => (
          <div key={lesson._id} className="lesson-card">
            <h3>{lesson.title}</h3>
            <Link to={`/lesson/${lesson._id}`}>View Lesson</Link>
          </div>
        ))}
      </div>
    </>
  );
}
