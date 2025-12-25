import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminNavbar() {
  const location = useLocation();

  const navItem = (path, label) => (
    <Link
      to={path}
      style={{
        padding: "10px 20px",
        margin: "0 10px",
        borderRadius: "8px",
        textDecoration: "none",
        backgroundColor:
          location.pathname === path ? "#FF595E" : "transparent",
        color: location.pathname === path ? "#fff" : "#333",
        fontWeight: "bold",
        transition: "0.3s",
      }}
    >
      {label}
    </Link>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        borderRadius: "0 0 12px 12px",
      }}
    >
      {navItem("/admin/categories", "Categories")}
      {navItem("/admin/subcategories", "Subcategories")}
      {navItem("/admin/courses", "Courses")}
      {navItem("/admin/lessons", "Lessons")}
    </div>
  );
}
