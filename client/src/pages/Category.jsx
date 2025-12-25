import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import "../styles/category.css";
import { AuthContext } from "../context/AuthContext";

export default function CategoryPage() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);

  // Load categories
  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const loadSubcategories = async (catId) => {
    setActiveCategory(catId);
    setActiveSubcategory(null);
    setCourses([]);
    setActiveCourse(null);
    try {
      const res = await api.get(`/subcategories/category/${catId}`);
      setSubcategories(res.data);
    } catch (err) { console.error(err); }
  };

  const loadCourses = async (subId) => {
    setActiveSubcategory(subId);
    setActiveCourse(null);
    try {
      const res = await api.get(`/courses/subcategory/${subId}`);
      setCourses(res.data);
    } catch (err) { console.error(err); }
  };

  const loadLessons = async (courseId) => {
    setActiveCourse(courseId);
    try {
      const res = await api.get(`/lessons/course/${courseId}`);
      setCourses(prev => prev.map(c => c._id === courseId ? { ...c, lessons: res.data } : c));
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout?.();
    navigate("/");
  };

  return (
    <>
      {/* 🌈✨ FULL WIDTH NAVBAR */}
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


      {/* 🌟 Main Category Page */}
      <div className="category-page">
        <header className="category-header">
          <h1>All Categories</h1>
          <p>Explore all topics and learn something new today!</p>
        </header>

        {/* Categories */}
        <section className="category-grid">
          {categories.map(cat => (
            <motion.div
              key={cat._id}
              className={`category-card ${activeCategory === cat._id ? "active" : ""}`}
              onClick={() => loadSubcategories(cat._id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3>{cat.name}</h3>
            </motion.div>
          ))}
        </section>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <section className="subcategory-section">
            <h2>Subcategories</h2>
            <div className="subcategory-chips">
              {subcategories.map(sub => (
                <button
                  key={sub._id}
                  className={`subcategory-chip ${activeSubcategory === sub._id ? "active" : ""}`}
                  onClick={() => loadCourses(sub._id)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <section className="courses-section">
            <h2>Courses</h2>
            <div className="courses-grid">
              {courses.map(course => (
                <motion.div
                  key={course._id}
                  className="course-card"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4>{course.title}</h4>
                  <p>{course.description}</p>
                  <div className="course-actions">
                    <button className="btn primary" onClick={() => loadLessons(course._id)}>Lessons</button>
                    <button className="btn ghost" onClick={() => navigate(`/course/${course._id}`)}>Details</button>
                  </div>

                  <AnimatePresence>
                    {course.lessons?.length > 0 && (
                      <motion.ul
                        className="course-lessons"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {course.lessons.map(l => (
                          <li key={l._id} onClick={() => navigate(`/lesson/${l._id}`)}>
                            {l.title}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
