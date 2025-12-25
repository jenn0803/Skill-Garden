import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaTrophy } from "react-icons/fa";

export default function MostViewedCourses() {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMostViewed();
  }, []);

  const fetchMostViewed = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/courses/most-viewed",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCourses(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching most viewed courses.");
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        🏆 Most Viewed Courses
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {courses.map((course, index) => (
          <div
            key={course._id}
            style={{
              background: "#fff",
              borderRadius: 15,
              padding: 20,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              #{index + 1} – {course.title}
            </div>

            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt="thumbnail"
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 10,
                  marginBottom: 15,
                }}
              />
            )}

            <div style={{ color: "#444", marginBottom: 10 }}>
              {course.description || "No description"}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 10,
                fontWeight: "bold",
              }}
            >
              <FaEye color="#FF595E" /> {course.views} Views
            </div>

            {index === 0 && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#FFD700",
                }}
              >
                <FaTrophy /> Top Course!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
