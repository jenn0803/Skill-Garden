import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaBook, FaList, FaVideo, FaChartLine } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/analytics",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(data);
    } catch (err) {
      console.error(err);
      alert("Error loading analytics");
    }
    setLoading(false);
  };

  if (loading) return <h2>Loading Analytics...</h2>;
  if (!stats) return <h2>No Data Available</h2>;

  const chartData = {
    labels: stats.weeklyViews.map((v) => v.day),
    datasets: [
      {
        data: stats.weeklyViews.map((v) => v.views),
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const cardStyle = {
    padding: 20,
    flex: 1,
    background: "#fff",
    borderRadius: 15,
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  };

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        📊 Admin – Site Analytics
      </h1>

      {/* STATS CARDS */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        <div style={cardStyle}>
          <FaUsers size={32} color="#FF6384" />
          <h3>{stats.totalUsers}</h3>
          <p>Users</p>
        </div>

        <div style={cardStyle}>
          <FaList size={32} color="#36A2EB" />
          <h3>{stats.totalCategories}</h3>
          <p>Categories</p>
        </div>

        <div style={cardStyle}>
          <FaBook size={32} color="#FFCD56" />
          <h3>{stats.totalCourses}</h3>
          <p>Courses</p>
        </div>

        <div style={cardStyle}>
          <FaVideo size={32} color="#4BC0C0" />
          <h3>{stats.totalLessons}</h3>
          <p>Lessons</p>
        </div>
      </div>

      {/* WEEKLY GRAPH */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 20,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>
          📆 Weekly Course Views <FaChartLine />
        </h2>

        <Line data={chartData} height={100} />
      </div>
    </>
  );
}
