import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaPlusCircle } from "react-icons/fa";
import { apiRequest } from "../../api/axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [subcats, setSubcats] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subCategory: "",
    description: "",
    duration: "",
    level: "Beginner",
    certificateAvailable: false,
    thumbnail: "",
  });

  const loadData = async () => {
    try {
      const [crs, subs] = await Promise.all([apiRequest("/courses"), apiRequest("/subcategories")]);
      setCourses(crs);
      setSubcats(subs);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      title: form.title,
      subcategoryId: form.subCategory,
      description: form.description,
      duration: form.duration,
      level: form.level,
      certificateAvailable: form.certificateAvailable,
      thumbnail: form.thumbnail,
    };

    if (editId) {
      await apiRequest(`/courses/${editId}`, "PUT", body);
    } else {
      await apiRequest("/courses", "POST", body);
    }

    setEditId(null);
    setForm({
      title: "",
      subCategory: "",
      description: "",
      duration: "",
      level: "Beginner",
      certificateAvailable: false,
      thumbnail: "",
    });

    loadData();
  };

  const handleEdit = (c) => {
    setEditId(c._id);
    setForm({
      title: c.title,
      subCategory: c.subcategoryId?._id,
      description: c.description,
      duration: c.duration,
      level: c.level,
      certificateAvailable: c.certificateAvailable,
      thumbnail: c.thumbnail,
    });
  };

  const handleDelete = async (id) => {
    await apiRequest(`/courses/${id}`, "DELETE");
    loadData();
  };

  // ================= NAVBAR =================
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
        <h2 style={styles.heading}>🎓 Courses Management</h2>
        <p style={styles.subheading}>
          Create, update and manage all your courses beautifully.
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div style={styles.container}>
        {/* LEFT CARD – FORM */}
        <div style={styles.formCard}>
          <h3 style={styles.cardTitle}>{editId ? "✏️ Edit Course" : "➕ Add New Course"}</h3>
          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="Course Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <select
              style={styles.input}
              value={form.subCategory}
              onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
              required
            >
              <option value="">Select Subcategory</option>
              {subcats.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <textarea
              style={{ ...styles.input, height: 80 }}
              placeholder="Short Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              style={styles.input}
              placeholder="Duration (e.g. 2 Months)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
            <select
              style={styles.input}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={form.certificateAvailable}
                onChange={(e) =>
                  setForm({ ...form, certificateAvailable: e.target.checked })
                }
              />
              Certificate Available
            </label>
            <input
              style={styles.input}
              placeholder="Thumbnail Image URL"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            />
            <button style={styles.button} type="submit">
              {editId ? "Update Course" : "Add Course"}
            </button>
          </form>
        </div>

        {/* RIGHT CARD – TABLE */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardTitle}>📚 All Courses</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Title</th>
                <th>Category</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Thumbnail</th>
                <th>Certificate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} style={styles.tableRow}>
                  <td>{c.title}</td>
                  <td>{c.subcategoryId?.name}</td>
                  <td>{c.level}</td>
                  <td>{c.duration}</td>
                  <td>
                    {c.thumbnail ? (
                      <img src={c.thumbnail} width="60" style={{ borderRadius: 8 }} />
                    ) : (
                      "None"
                    )}
                  </td>
                  <td>{c.certificateAvailable ? "Yes" : "No"}</td>
                  <td>
                    <button style={styles.editBtn} onClick={() => handleEdit(c)}>Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(c._id)}>Delete</button>
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

/* ================= STYLES ================= */
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

  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#3E1B7A",
  },

  subheading: {
    fontSize: 15,
    opacity: 0.7,
  },

  container: {
    display: "flex",
    gap: 25,
  },

  formCard: {
    flex: 1,
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

  cardTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "700",
  },

  formGrid: {
    display: "grid",
    gap: 15,
  },

  input: {
    padding: "12px 15px",
    borderRadius: 10,
    border: "1px solid #c9b7ff",
    background: "#F8F4FF",
    fontSize: 15,
    color: "black",
  },

  checkbox: {
    display: "flex",
    gap: 10,
    fontSize: 15,
    color: "black",
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
    boxShadow: "0 4px 12px rgba(122,56,255,0.3)",
    transition: "0.3s",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tableHeader: {
    background: "#EFE3FF",
    color: "black",
  },

  tableRow: {
    borderBottom: "1px solid #eee",
  },

  editBtn: {
    padding: "6px 12px",
    marginRight: 6,
    borderRadius: 6,
    border: "none",
    background: "#6735f7",
    color: "white",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#E53935",
    color: "white",
    cursor: "pointer",
  },
};
