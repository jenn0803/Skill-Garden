// // client/src/pages/AdminDashboard.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";

// export default function AdminDashboard() {
//   const [category, setCategory] = useState({ name: "", description: "" });
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     if (!token) return alert("No token found. Please login.");
//     try {
//       const { data } = await axios.get(
//         "http://localhost:5000/api/admin/category",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setCategories(data);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       alert(
//         err.response?.data?.msg ||
//           "Error fetching categories. Are you logged in as admin?"
//       );
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setCategory({ ...category, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!category.name) return alert("Category name is required.");
//     try {
//       await axios.post("http://localhost:5000/api/admin/category", category, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Category added successfully!");
//       setCategory({ name: "", description: "" });
//       fetchCategories();
//     } catch (err) {
//       console.error(err);
//       alert(
//         err.response?.data?.msg ||
//           "Error adding category. Are you logged in as admin?"
//       );
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?"))
//       return;
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/category/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchCategories();
//     } catch (err) {
//       console.error(err);
//       alert(
//         err.response?.data?.msg ||
//           "Error deleting category. Are you logged in as admin?"
//       );
//     }
//   };

//   if (loading) return <div className="text-center mt-10">Loading...</div>;

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
//         padding: "40px 20px",
//         fontFamily: "'Poppins', sans-serif",
//       }}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         style={{
//           backgroundColor: "#fff",
//           borderRadius: 20,
//           padding: 30,
//           maxWidth: 900,
//           margin: "0 auto",
//           boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h1
//           style={{
//             textAlign: "center",
//             marginBottom: 30,
//             color: "#333",
//             fontWeight: "700",
//             fontSize: "2rem",
//           }}
//         >
//           🌸 Admin Dashboard
//         </h1>

//         {/* Add Category Form */}
//         <motion.form
//           onSubmit={handleSubmit}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 15,
//             backgroundColor: "#f8f9fa",
//             padding: 25,
//             borderRadius: 15,
//             marginBottom: 40,
//           }}
//         >
//           <h2 style={{ color: "#FF595E", marginBottom: 10 }}>Add Category</h2>
//           <input
//             name="name"
//             value={category.name}
//             onChange={handleChange}
//             placeholder="Category Name"
//             required
//             style={{
//               padding: 12,
//               borderRadius: 10,
//               border: "1px solid #ccc",
//               outline: "none",
//               fontSize: 16,
//             }}
//           />
//           <input
//             name="description"
//             value={category.description}
//             onChange={handleChange}
//             placeholder="Description"
//             style={{
//               padding: 12,
//               borderRadius: 10,
//               border: "1px solid #ccc",
//               outline: "none",
//               fontSize: 16,
//             }}
//           />
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             style={{
//               padding: "12px 20px",
//               borderRadius: 10,
//               border: "none",
//               background: "#FF595E",
//               color: "#fff",
//               fontWeight: "bold",
//               fontSize: 16,
//               cursor: "pointer",
//               boxShadow: "0 4px 10px rgba(255, 89, 94, 0.4)",
//             }}
//           >
//             ➕ Add Category
//           </motion.button>
//         </motion.form>

//         {/* Existing Categories */}
//         <h2 style={{ color: "#333", marginBottom: 20 }}>📂 Existing Categories</h2>
//         {categories.length === 0 ? (
//           <p style={{ color: "#666" }}>No categories yet.</p>
//         ) : (
//           <motion.ul
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6 }}
//             style={{
//               listStyle: "none",
//               padding: 0,
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//               gap: 20,
//             }}
//           >
//             {categories.map((cat) => (
//               <motion.li
//                 key={cat._id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4 }}
//                 whileHover={{ scale: 1.02 }}
//                 style={{
//                   backgroundColor: "#fff",
//                   padding: 20,
//                   borderRadius: 15,
//                   boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   minHeight: 140,
//                 }}
//               >
//                 <div>
//                   <strong style={{ fontSize: 18 }}>{cat.name}</strong>
//                   <p style={{ color: "#555", marginTop: 5 }}>
//                     {cat.description || "No description"}
//                   </p>
//                 </div>
//                 <motion.button
//                   whileHover={{
//                     scale: 1.05,
//                     backgroundColor: "#ff1c1c",
//                   }}
//                   onClick={() => handleDelete(cat._id)}
//                   style={{
//                     marginTop: 10,
//                     padding: "6px 10px",
//                     border: "none",
//                     borderRadius: 8,
//                     backgroundColor: "#FF595E",
//                     color: "#fff",
//                     cursor: "pointer",
//                     alignSelf: "flex-end",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   🗑 Delete
//                 </motion.button>
//               </motion.li>
//             ))}
//           </motion.ul>
//         )}
//       </motion.div>
//     </div>
//   );
// }


// client/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import {
  FaUsers,
  FaLayerGroup,
  FaList,
  FaBook,
  FaVideo,
  FaFire,
  FaHome,
  FaPlusCircle,
} from "react-icons/fa";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/analytics",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(data);
    } catch (err) {
      console.log(err);
      alert("Could not load admin dashboard");
    }
  };

  if (!stats) return <h2>Loading Dashboard...</h2>;

  // ================= Navbar Styles =================
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

  // ================= Card Styles =================
  const card = {
    padding: 25,
    flex: 1,
    background: "#fff",
    borderRadius: 15,
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  };

  const weeklyChart = {
    labels: stats.weeklyViews.map((x) => x.day),
    datasets: [
      {
        data: stats.weeklyViews.map((x) => x.views),
        borderColor: "#9d4edd",
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={{ padding: 30, background: "#f4f4f9", minHeight: "100vh" }}>
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

      {/* ================= DASHBOARD CONTENT ================= */}
      <h1 style={{ textAlign: "center", marginBottom: 30, color: "#333" }}>
        📊 Admin Dashboard
      </h1>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={card}>
          <FaUsers size={32} color="#FF6384" />
          <h3 style={{ 
    fontSize: '28px', 
    fontWeight: '700', 
    color: '#000', 
    fontFamily: "'Poppins', sans-serif", 
    margin: '10px 0 5px 0' 
}}>
    {stats.totalUsers}
</h3>
<p style={{ 
    fontSize: '16px', 
    color: '#000', 
    fontWeight: '500', 
    fontFamily: "'Poppins', sans-serif", 
    margin: 0 
}}>
    Users
</p>

        </div>

        <div style={card}>
          <FaLayerGroup size={32} color="#36A2EB" />
          <h3 style={{ 
    fontSize: '28px', 
    fontWeight: '700', 
    color: '#000', 
    fontFamily: "'Poppins', sans-serif", 
    margin: '10px 0 5px 0' 
}}>
    {stats.totalCategories}
</h3>
<p style={{ 
    fontSize: '16px', 
    color: '#000', 
    fontWeight: '500', 
    fontFamily: "'Poppins', sans-serif", 
    margin: 0 
}}>
    Categories
</p>

        </div>

        <div style={card}>
          <FaList size={32} color="#FFCD56" />
          <h3 style={{ 
    fontSize: '28px', 
    fontWeight: '700', 
    color: '#000', 
    fontFamily: "'Poppins', sans-serif", 
    margin: '10px 0 5px 0' 
}}>
    {stats.totalSubCategories}
</h3>
<p style={{ 
    fontSize: '16px', 
    color: '#000', 
    fontWeight: '500', 
    fontFamily: "'Poppins', sans-serif", 
    margin: 0 
}}>
    Subcategories
</p>

        </div>

        <div style={card}>
          <FaBook size={32} color="#4BC0C0" />
          <h3 style={{ 
    fontSize: '28px', 
    fontWeight: '700', 
    color: '#000', 
    fontFamily: "'Poppins', sans-serif", 
    margin: '10px 0 5px 0' 
}}>
    {stats.totalCourses}
</h3>
<p style={{ 
    fontSize: '16px', 
    color: '#000', 
    fontWeight: '500', 
    fontFamily: "'Poppins', sans-serif", 
    margin: 0 
}}>
    Courses
</p>

        </div>

        <div style={card}>
          <FaVideo size={32} color="#9966FF" />
          <h3 style={{ 
    fontSize: '28px', 
    fontWeight: '700', 
    color: '#000', 
    fontFamily: "'Poppins', sans-serif", 
    margin: '10px 0 5px 0' 
}}>
    {stats.totalLessons}
</h3>
<p style={{ 
    fontSize: '16px', 
    color: '#000', 
    fontWeight: '500', 
    fontFamily: "'Poppins', sans-serif", 
    margin: 0 
}}>
    Lessons
</p>

        </div>
      </div>


      {/* Most Viewed Courses */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ color: "#333" }}>
          🔥 Most Viewed Courses <FaFire />
        </h2>

        {stats.mostViewed.map((c) => (
          <div
            key={c._id}
            style={{
              padding: 15,
              margin: "10px 0",
              background: "#9d4edd",
              color: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <b>{c.title}</b> — {c.views} views
          </div>
        ))}
      </div>

      {/* Recently Added Courses */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ color: "#333" }}>🆕 Recently Added Courses</h2>

        {stats.recentCourses.map((c) => (
          <div
            key={c._id}
            style={{
              padding: 15,
              margin: "10px 0",
              background: "#9d4edd",
              color: "#fff",
              borderRadius: 12,
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <b>{c.title}</b> — Added on {new Date(c.createdAt).toLocaleDateString()}
          </div>
        ))}
      </div>
    </div>
  );
}
