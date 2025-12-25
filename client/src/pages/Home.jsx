// client/src/pages/Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import "../styles/home.css";

/**
 * Home page with voice-enabled search (microphone inside the search bar - Option A)
 * - Uses Web Speech API (SpeechRecognition) when available (free, built-in).
 * - Inserts transcript into `searchTerm` and triggers your existing instant search effect.
 */

export default function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // optional if you store it

  // voice-related
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null); // holds SpeechRecognition instance
  const interimRef = useRef(""); // interim transcript

  // --------------------------
  // LOGOUT FUNCTION
  // --------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  // --------------------------
  // Notifications loader
  // --------------------------
  useEffect(() => {
    if (token && userId) {
      api
        .get(`/notifications?userId=${userId}`)
        .then((res) => {
          // backend might return either array or { notifications: [] }
          const data = res.data.notifications ?? res.data;
          setNotifications(data || []);
          setUnreadCount((data || []).filter((n) => !n.read).length);
        })
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  }, [token, userId]);

  // --------------------------
  // Load categories
  // --------------------------
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  // --------------------------
  // Load subcategories / courses / lessons
  // --------------------------
  const loadSubcategories = async (catId) => {
    setActiveCategory(catId);
    setCourses([]);
    setLessons([]);
    setActiveSubcategory(null);
    setActiveCourse(null);

    try {
      const res = await api.get(`/subcategories/category/${catId}`);
      setSubcategories(res.data);
    } catch (err) {
      console.error("Error loading subcategories:", err);
    }
  };

  const loadCourses = async (subId) => {
    setActiveSubcategory(subId);
    setLessons([]);
    setActiveCourse(null);

    try {
      const res = await api.get(`/courses/subcategory/${subId}`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  const loadLessons = async (courseId) => {
    setActiveCourse(courseId);

    try {
      const res = await api.get(`/lessons/course/${courseId}`);
      setLessons(res.data);
    } catch (err) {
      console.error("Error loading lessons:", err);
    }
  };
  // --------------------------
  // INSTANT SEARCH FUNCTION (unchanged)
  // --------------------------
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(searchTerm)}`);
        const combinedResults = [
          ...res.data.categories.map((c) => ({ ...c, type: "Category" })),
          ...res.data.subcategories.map((s) => ({ ...s, type: "Subcategory" })),
          ...res.data.courses.map((c) => ({ ...c, type: "Course" })),
          ...res.data.lessons.map((l) => ({ ...l, type: "Lesson" })),
        ];
        setSearchResults(combinedResults);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSelectResult = (item) => {
    setSearchTerm("");
    setShowDropdown(false);

    if (item.type === "Course") navigate(`/course/${item._id}`);
    else if (item.type === "Lesson") navigate(`/lesson/${item._id}`);
    else if (item.type === "Category") loadSubcategories(item._id);
    else if (item.type === "Subcategory") loadCourses(item._id);
  };

  const displayedCourses = courses.slice(0, 3);

  // --------------------------
  // VOICE SEARCH (Web Speech API)
  // --------------------------
  const browserSupportsSpeech = () => {
    const w = window;
    return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
  };

  // initialize recognition lazily
  const initRecognition = () => {
    if (!browserSupportsSpeech()) return null;
    if (recognitionRef.current) return recognitionRef.current;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false; // we will re-start when user clicks again

    recognition.onstart = () => {
      setListening(true);
      interimRef.current = "";
    };

    recognition.onend = () => {
      setListening(false);
      // Note: if you want continuous listen, you can restart here.
    };

    recognition.onerror = (event) => {
      console.error("SpeechRecognition error:", event);
      setListening(false);
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      // show interim results live in the search input (for nice UX)
      interimRef.current = interim;
      if (finalTranscript) {
        // Found final transcript -> set it and trigger search effect
        setSearchTerm((prev) => {
          // if interim existed, replace it; otherwise append
          const newTerm = finalTranscript.trim();
          return newTerm;
        });
        // Open dropdown — the instant search effect will run because searchTerm changed
        setShowDropdown(true);
      } else {
        // update input with interim for live feel
        setSearchTerm((prev) => {
          // show interim but do not override a user typed + keep caret behaviour simple
          return interimRef.current || prev;
        });
      }
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  const toggleListening = () => {
    if (!browserSupportsSpeech()) {
      alert(
        "Voice search isn't supported in this browser."
      );
      return;
    }

    const rec = initRecognition();
    if (!rec) return;

    if (listening) {
      // stop listening
      try {
        rec.stop();
      } catch (e) {
        console.warn("stop error", e);
        setListening(false);
      }
    } else {
      // start listening
      try {
        // clear previous interim and set UI
        interimRef.current = "";
        // focus the search input for helpful UX
        const el = document.querySelector(".pg-search-input");
        if (el) el.focus();
        rec.start();
      } catch (e) {
        console.error("start error", e);
      }
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onstart = null;
          recognitionRef.current.stop?.();
        } catch (e) {}
      }
    };
  }, []);

  // small helper so pressing Enter in input won't lose dropdown (keeps current behaviour)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // If user pressed enter, we'll just keep existing behaviour (instant search already triggered)
      setShowDropdown(true);
    }
  };

  return (
    <div className="pg-container">
      {/* NAVBAR */}
      <nav className="sg-navbar">
        <div className="sg-nav-left" onClick={() => navigate("/")}>
          <h2 className="sg-logo">🌱 SkillGarden</h2>
        </div>

        <div className="sg-nav-center">
          <Link to="/" className="sg-nav-link">Home</Link>
          <Link to="/categories" className="sg-nav-link">Categories</Link>
          <Link to="/courses" className="sg-nav-link">Courses</Link>
          <Link to="/contact-us" className="sg-nav-link">Contact Us</Link>
        </div>

        <div className="sg-nav-right">
          {/* Notification Bell */}
          {token && (
            <div className="sg-notification" onClick={() => navigate("/notifications")}>
              🔔
              {unreadCount > 0 && <span className="sg-notification-badge">{unreadCount}</span>}
            </div>
          )}

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

      {/* Background */}
      <div className="pg-background">
        <svg className="pg-wave-top" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path d="M0,64 C180,200 360,0 720,60 C1080,120 1260,40 1440,80 L1440 0 L0 0 Z" />
        </svg>
        <svg className="pg-wave-bottom" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path d="M0,120 C200,40 420,220 720,180 C1020,140 1240,260 1440,200 L1440 220 L0 220 Z" />
        </svg>
      </div>

      {/* Main Page */}
      <main className="pg-main">
        <motion.header
          className="pg-hero"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="pg-hero-left">
            <h1 className="pg-title">
              <span className="pg-glow-emoji">✨</span>
              SkillGarden
              <span className="pg-tagline"> — learn like magic</span>
            </h1>

            <p className="pg-sub">Learn Something New !!! Daily.</p>

            {/* Search Input WITH MIC BUTTON (Option A) */}
            <div className="pg-search-wrapper" style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
              <input
                className="pg-search-input"
                placeholder="Search courses, topics, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Search courses"
                autoComplete="off"
                style={{ paddingRight: 54 }} // space for mic button
              />

              

              {/* small spinner / status */}
              {loading && <span className="pg-search-loading" style={{ position: "absolute", right: 76, color: "#dcd6ff" }}>Searching...</span>}

              {/* Mic Button (inside right side of input) */}
              <button
                onClick={toggleListening}
                title={listening ? "Stop listening" : "Start voice search"}
                aria-pressed={listening}
                style={{
                  position: "absolute",
                  right: 8,
                  height: 38,
                  width: 38,
                  borderRadius: 999,
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: listening ? "0 8px 24px rgba(107,62,196,0.28)" : "0 6px 18px rgba(0,0,0,0.2)",
                  background: listening ? "linear-gradient(90deg,#ff6b6b,#ffb86b)" : "linear-gradient(90deg,#7a3cff,#a969ff)",
                  color: "#fff",
                  transition: "transform .12s ease, box-shadow .12s ease",
                }}
              >
                {/* mic icon and pulse */}
                <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
                    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 11a7 7 0 0 1-14 0" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 19v3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  {listening && (
                    <span
                      style={{
                        position: "absolute",
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "rgba(255, 120, 120, 0.14)",
                        animation: "pulse 1s infinite",
                        zIndex: -1,
                      }}
                    />
                  )}
                </span>
              </button>

              <style>{`
                @keyframes pulse {
                  0% { transform: scale(0.9); opacity: 0.7; }
                  50% { transform: scale(1.08); opacity: 1; }
                  100% { transform: scale(0.9); opacity: 0.7; }
                }
                /* search dropdown override position to align with the new padding */
                .pg-search-dropdown { margin-top: 8px; }
              `}</style>

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <ul className="pg-search-dropdown" style={{ position: "absolute", left: 0, right: 0, zIndex: 30 }}>
                  {searchResults.map((item) => (
                    <li key={item._id} onClick={() => handleSelectResult(item)} style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", cursor: "pointer" }}>
                      <span className="result-title">{item.title || item.name}</span>
                      <span className="result-type" style={{ opacity: 0.8 }}>{item.type}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pg-chips-compact">
              {categories.slice(0, 7).map((c) => (
                <button
                  key={c._id}
                  className={`pg-chip ${activeCategory === c._id ? "active" : ""}`}
                  onClick={() => loadSubcategories(c._id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pg-hero-right">
            <div className="pg-card-hero">
              <div className="pg-card-header">Featured Course</div>
              <div className="pg-card-body">
                <h3>Mastering Modern Skills</h3>
                <p>Curated paths to upskill with real projects and mentorship.</p>
                <div className="pg-card-cta">
                  <button className="btn primary" onClick={() => navigate("/courses")}>Explore</button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* SUBCATEGORIES */}
        {subcategories.length > 0 && (
          <section className="pg-section">
            <h3 className="pg-section-title">Subcategories</h3>
            <div className="pg-chips-row">
              {subcategories.map((s) => (
                <button
                  key={s._id}
                  className={`pg-chip small ${activeSubcategory === s._id ? "alt" : ""}`}
                  onClick={() => loadCourses(s._id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* COURSES */}
        <section className="pg-section">
          <h3 className="pg-section-title">Courses</h3>
          <div className="pg-grid">
            {displayedCourses.map((course) => (
              <motion.article
                layout
                whileHover={{ scale: 1.02 }}
                className="pg-card"
                key={course._id}
              >
                <div className="pg-card-media" />
                <div className="pg-card-content">
                  <h4 className="pg-card-title">{course.title}</h4>
                  <p className="pg-card-desc">{course.description}</p>
                  <div className="pg-card-actions">
                    <button className="btn primary" onClick={() => loadLessons(course._id)}>Lessons</button>
                    <button className="btn ghost" onClick={() => navigate(`/course/${course._id}`)}>Details</button>
                  </div>

                  <AnimatePresence>
                    {activeCourse === course._id && lessons.length > 0 && (
                      <motion.ul
                        className="pg-lessons"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                      >
                        {lessons.map((l) => (
                          <li key={l._id} onClick={() => navigate(`/lesson/${l._id}`)}>
                            {l.title}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
