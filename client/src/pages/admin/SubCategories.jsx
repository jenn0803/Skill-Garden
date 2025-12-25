import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaPlusCircle } from "react-icons/fa";
import { apiRequest } from "../../api/axios";

export default function SubCategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", description: "" });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    try {
      const [subs, cats] = await Promise.all([
        apiRequest("/subcategories"),
        apiRequest("/categories"),
      ]);

      const subArray = Array.isArray(subs) ? subs : subs.data;
      const catArray = Array.isArray(cats) ? cats : cats.data;

      setSubcategories(subArray || []);
      setCategories(catArray || []);
    } catch (error) {
      console.error("Failed to load:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      categoryId: form.category,
    };

    try {
      if (editId) {
        await apiRequest(`/subcategories/${editId}`, "PUT", payload);
      } else {
        await apiRequest("/subcategories", "POST", payload);
      }

      setForm({ name: "", category: "", description: "" });
      setEditId(null);
      loadData();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleEdit = (sub) => {
    setEditId(sub._id);
    setForm({
      name: sub.name,
      category: sub.categoryId?._id || "",
      description: sub.description || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/subcategories/${id}`, "DELETE");
      loadData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

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
        <h2 style={styles.heading}>🧩 Subcategories Management</h2>
        <p style={styles.subheading}>
          Create, edit & organize all subcategories linked with categories.
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div style={styles.container}>
        {/* LEFT FORM CARD */}
        <div style={styles.formCard}>
          <h3 style={styles.cardTitle}>
            {editId ? "✏️ Edit Subcategory" : "➕ Add New Subcategory"}
          </h3>

          <form onSubmit={handleSubmit} style={styles.formGrid}>
            <input
              style={styles.input}
              placeholder="Subcategory Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <select
              style={styles.input}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <textarea
              style={{ ...styles.input, height: 80 }}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button style={styles.button} type="submit">
              {editId ? "Update Subcategory" : "Add Subcategory"}
            </button>
          </form>
        </div>

        {/* RIGHT TABLE CARD */}
        <div style={styles.tableCard}>
          <h3 style={styles.cardTitle}>📋 All Subcategories</h3>

          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {subcategories.map((s) => (
                <tr key={s._id} style={styles.tableRow}>
                  <td>{s.name}</td>
                  <td>{s.categoryId?.name || "—"}</td>
                  <td>{s.description}</td>
                  <td>
                    <button style={styles.editBtn} onClick={() => handleEdit(s)}>
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(s._id)}
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
