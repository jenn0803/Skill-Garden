import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaPlusCircle, FaYoutube } from "react-icons/fa";
import apiRequest from "../../api/axios";

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    courseId: "",
    order: 0,
    videoUrl: "",
    resources: [],
    quiz: [{ question: "", options: ["", "", "", ""], correctIndex: 0 }],
  });

  // Load Data
  const loadData = async () => {
    try {
      const [l, c] = await Promise.all([
        apiRequest.get("/lessons"),
        apiRequest.get("/courses"),
      ]);

      setLessons(l.data || []);
      setCourses(c.data || []);
    } catch (err) {
      console.error("Error loading:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = { ...form };

    try {
      if (editId) {
        await apiRequest.put(`/lessons/${editId}`, body);
      } else {
        await apiRequest.post("/lessons", body);
      }

      setEditId(null);
      setForm({
        title: "",
        courseId: "",
        order: 0,
        videoUrl: "",
        resources: [],
        quiz: [{ question: "", options: ["", "", "", ""], correctIndex: 0 }],
      });

      loadData();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleEdit = (l) => {
    setEditId(l._id);
    setForm({
      title: l.title,
      courseId: l.courseId?._id || "",
      order: l.order,
      videoUrl: l.videoUrl || "",
      resources: l.resources || [],
      quiz: l.quiz.length
        ? l.quiz
        : [{ question: "", options: ["", "", "", ""], correctIndex: 0 }],
    });
  };

  const handleDelete = async (id) => {
    await apiRequest.delete(`/lessons/${id}`);
    loadData();
  };

  // Resource Functions
  const addResource = () =>
    setForm({ ...form, resources: [...form.resources, ""] });

  const updateResource = (value, index) => {
    const arr = [...form.resources];
    arr[index] = value;
    setForm({ ...form, resources: arr });
  };

  // Quiz Functions
  const addQuizQuestion = () =>
    setForm({
      ...form,
      quiz: [
        ...form.quiz,
        { question: "", options: ["", "", "", ""], correctIndex: 0 },
      ],
    });

  const updateQuizQuestion = (i, key, value) => {
    const arr = [...form.quiz];
    arr[i][key] = value;
    setForm({ ...form, quiz: arr });
  };

  const updateQuizOption = (qi, oi, value) => {
    const arr = [...form.quiz];
    arr[qi].options[oi] = value;
    setForm({ ...form, quiz: arr });
  };

  /* ================= NAVBAR STYLES ================= */
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
    <div style={styles.page}>
      {/* ================= NAVBAR ================= */}
      <div style={navbar}>
        <h2 style={{ margin: 0, fontSize: "22px" }}>⚡ Admin Panel</h2>
        <div style={navLinks}>
          {[
             { icon:<FaHome />, label :"Admin Panel", link:"/admin/AdminDashboard"},
                        { icon: <FaPlusCircle />, label: "Meesages", link: "/admin/AdminMessage" },
                        { icon: <FaPlusCircle />, label: "Add Category", link: "/admin/categories" },
                        { icon: <FaPlusCircle />, label: "Add Subcategory", link: "/admin/subcategories" },
                        { icon: <FaPlusCircle />, label: "Add Course", link: "/admin/courses" },
                        { icon: <FaPlusCircle />, label: "Add Lesson", link: "/admin/lessons" },
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

      {/* ================= HEADER ================= */}
      <div style={styles.headerBox}>
        <h2 style={styles.heading}>📘 Lessons Management</h2>
        <p style={styles.subheading}>
          Create, edit and manage lesson content with ease.
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div style={styles.container}>
        {/* FORM CARD */}
        <div style={styles.formCard}>
          <h3 style={styles.cardTitle}>{editId ? "✏️ Edit Lesson" : "➕ Add New Lesson"}</h3>

          {/* ---------------- YOUTUBE UPLOAD BUTTON ---------------- */}
          <button
            style={styles.youtubeButton}
            type="button"
            onClick={() =>
              window.open(
                "https://studio.youtube.com/channel/UCy-CnZNznZgZPSQA5LEWUQA",
                "_blank"
              )
            }
          >
            <FaYoutube size={22} /> Upload Video on YouTube
          </button>

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="Lesson Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <select
              style={styles.input}
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>

            <input
              type="number"
              style={styles.input}
              placeholder="Lesson Order"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />

            <input
              style={styles.input}
              placeholder="YouTube Video URL"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            />

            <h4 style={styles.sectionTitle}>📎 Resources</h4>
            {form.resources.map((r, i) => (
              <input
                key={i}
                style={styles.input}
                placeholder={`Resource ${i + 1}`}
                value={r}
                onChange={(e) => updateResource(e.target.value, i)}
              />
            ))}
            <button type="button" style={styles.addBtn} onClick={addResource}>
              ➕ Add Resource
            </button>

            <h4 style={styles.sectionTitle}>❓ Quiz Section</h4>
            {form.quiz.map((q, qIndex) => (
              <div key={qIndex} style={styles.quizBox}>
                <input
                  style={styles.input}
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) =>
                    updateQuizQuestion(qIndex, "question", e.target.value)
                  }
                />

                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    style={styles.input}
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      updateQuizOption(qIndex, optIndex, e.target.value)
                    }
                  />
                ))}

                <select
                  style={styles.input}
                  value={q.correctIndex}
                  onChange={(e) =>
                    updateQuizQuestion(
                      qIndex,
                      "correctIndex",
                      Number(e.target.value)
                    )
                  }
                >
                  <option value="0">Correct Option 1</option>
                  <option value="1">Correct Option 2</option>
                  <option value="2">Correct Option 3</option>
                  <option value="3">Correct Option 4</option>
                </select>
              </div>
            ))}

            <button type="button" style={styles.addBtn} onClick={addQuizQuestion}>
              ➕ Add Quiz Question
            </button>

            <button type="submit" style={styles.button}>
              {editId ? "Update Lesson" : "Add Lesson"}
            </button>
          </form>
        </div>

        {/* TABLE CARD */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardTitle}>📚 All Lessons</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Title</th>
                <th>Course</th>
                <th>Order</th>
                <th>Video</th>
                <th>Quiz</th>
                <th>Resources</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {lessons.map((l) => (
                <tr key={l._id} style={styles.tableRow}>
                  <td>{l.title}</td>
                  <td>{l.courseId?.title}</td>
                  <td>{l.order}</td>
                  <td>{l.videoUrl}</td>
                  <td>{l.quiz?.length} questions</td>
                  <td>{l.resources?.length} items</td>
                  <td>
                    <button style={styles.editBtn} onClick={() => handleEdit(l)}>
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(l._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= FULL PAGE STYLES ================= */
const styles = {
  page: {
    background: "linear-gradient(135deg, #EDE4FF, #FFF8FF)",
    minHeight: "100vh",
    padding: 30,
    color: "black",
    fontFamily: "Poppins",
  },

  headerBox: {
    background: "rgba(255,255,255,0.6)",
    padding: 25,
    borderRadius: 16,
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    marginBottom: 30,
    border: "1px solid #e0cfff",
  },

  heading: { fontSize: 32, fontWeight: "800", color: "#3E1B7A" },
  subheading: { fontSize: 15, opacity: 0.7 },

  container: { display: "flex", gap: 25 },
  formCard: {
    flex: 1.3,
    background: "white",
    padding: 25,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },
  tableCard: {
    flex: 2,
    background: "white",
    padding: 25,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  },

  cardTitle: { fontSize: 20, marginBottom: 15, fontWeight: "700" },
  formGrid: { display: "grid", gap: 12 },
  input: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #c9b7ff",
    background: "#F8F4FF",
    fontSize: 14,
    color: "black",
  },

  youtubeButton: {
    background: "#FF0000",
    color: "white",
    padding: "10px 15px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
    fontSize: 15,
  },

  button: {
    padding: "12px",
    background: "linear-gradient(135deg, #7A38FF, #AB61FF)",
    border: "none",
    borderRadius: 10,
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    cursor: "pointer",
    marginTop: 10,
  },

  addBtn: {
    background: "#7A38FF",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    marginBottom: 5,
  },

  sectionTitle: { margin: "10px 0 5px 0", fontWeight: "600" },

  quizBox: {
    background: "#F5EEFF",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #d8c8ff",
    marginBottom: 10,
  },

  table: { width: "100%", borderCollapse: "collapse", marginTop: 10 },
  tableHeader: { background: "#EFE3FF", color: "black" },
  tableRow: { borderBottom: "1px solid #eee" },

  editBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    background: "#6735f7",
    color: "white",
    border: "none",
    marginRight: 6,
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    background: "#E53935",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
