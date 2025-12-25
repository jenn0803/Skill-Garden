import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaPlusCircle } from "react-icons/fa";
import { apiRequest } from "../../api/axios";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  const loadCategories = async () => {
    const data = await apiRequest("/categories");
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await apiRequest(`/categories/${editId}`, "PUT", form);
    } else {
      await apiRequest("/categories", "POST", form);
    }

    setForm({ name: "", description: "" });
    setEditId(null);
    loadCategories();
  };

  const handleDelete = async (id) => {
    await apiRequest(`/categories/${id}`, "DELETE");
    loadCategories();
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, description: cat.description });
  };

  useEffect(() => {
    loadCategories();
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

  const navHover = {
    background: "rgba(255,255,255,0.2)",
    transform: "scale(1.05)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
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

      {/* ================= HEADER BOX ================= */}
      <div style={styles.headerBox}>
        <h2 style={styles.heading}>📁 Category Management</h2>
        <p style={styles.subheading}>
          Add and manage all your categories in one place.
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div style={styles.container}>
        {/* LEFT FORM CARD */}
        <div style={styles.formCard}>
          <h3 style={styles.cardTitle}>
            {editId ? "✏️ Edit Category" : "➕ Add Category"}
          </h3>

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <textarea
              style={{ ...styles.input, height: 80 }}
              placeholder="Short Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button style={styles.button} type="submit">
              {editId ? "Update Category" : "Add Category"}
            </button>
          </form>
        </div>

        {/* RIGHT TABLE CARD */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardTitle}>📋 All Categories</h3>

          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((c) => (
                <tr key={c._id} style={styles.tableRow}>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(c._id)}
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
    marginBottom: 5,
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
