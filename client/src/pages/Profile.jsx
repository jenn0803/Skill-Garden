import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";


export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const [progress, setProgress] = useState({
    viewedCourses: [],
    completedLessons: [],
    totalCompletedLessons: 0,
    courseProgress: [],
  });

  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id || payload.userId;
      setUser(payload);

      // Fetch progress
      axios
        .get("http://localhost:5000/api/progress/profile", { params: { userId } })
        .then((res) => {
          const data = res.data || {};
          setProgress({
            viewedCourses: Array.isArray(data.viewedCourses)
              ? data.viewedCourses.filter((c) => c)
              : [],
            completedLessons: Array.isArray(data.completedLessons)
              ? data.completedLessons.filter((l) => l)
              : [],
            totalCompletedLessons: data.totalCompletedLessons || 0,
            courseProgress: Array.isArray(data.courseProgress)
              ? data.courseProgress
              : [],
          });
        })
        .catch(console.error);

      // Fetch certificates
      axios
        .get("http://localhost:5000/api/certificate", { params: { userId } })
        .then((res) => setCertificates(res.data.certificates || []))
        .catch(console.error);
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return <div className="error-msg">Please login first</div>;
  }

  return (
    <>
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
     

      {/* Main Content */}
      <div className="profile-container">
        <h1>👤 Profile</h1>

        {/* User Info */}
        <div className="card user-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Courses & Progress */}
        <h2>📘 Courses & Progress</h2>
        {progress.viewedCourses.length === 0 ? (
          <p>No viewed courses yet.</p>
        ) : (
          <div className="cards-container">
            {progress.viewedCourses.map((course, i) => {
              const cp = progress.courseProgress.find(c => c?.courseId === course._id);
              const percent = cp?.percent || 0;
              return (
                <div key={i} className="card course-card">
                  <p><strong>Course:</strong> {course.title}</p>
                  <p className="description">{course.description}</p>
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${percent}%` }}></div>
                  </div>
                  <p>{percent}% completed</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed Lessons */}
        <h2>✅ Completed Lessons</h2>
        {progress.completedLessons.length === 0 ? (
          <p>No completed lessons yet.</p>
        ) : (
          <div className="cards-container">
            {progress.completedLessons.map((lesson, i) => (
              <div key={i} className="card lesson-card">
                <p><strong>Lesson:</strong> {lesson.title}</p>
                <p className="description">Course: {lesson.courseTitle || "Unknown"}</p>
              </div>
            ))}
          </div>
        )}

        {/* Total Completed */}
        <div className="card total-completed">
          <h3>🎯 Total Lessons Completed: {progress.totalCompletedLessons}</h3>
        </div>

        {/* Certificates */}
        <h2>🎓 Certificates</h2>
        {certificates.length === 0 ? (
          <p>No certificates earned yet. Complete a course to earn one!</p>
        ) : (
          <div className="cards-container">
            {certificates.map((cert, i) => (
              <div key={i} className="card certificate-card">
                <p><strong>Course:</strong> {cert.courseId?.title}</p>
                <p>Issued on: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                <a href={cert.certificateUrl} target="_blank" rel="noreferrer" className="btn filled">
                  View / Download Certificate
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
