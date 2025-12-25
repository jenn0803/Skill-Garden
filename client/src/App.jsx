import React, { useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Course from "./pages/Course";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Categories from "./pages/admin/Categories";
import SubCategories from "./pages/admin/SubCategories";
import Courses from "./pages/admin/Courses";
import Lessons from "./pages/admin/Lessons";
import LessonPage from "./pages/LessonPage";
import CoursePage from "./pages/CoursePage";
import ContactUs from "./pages/ContactUs";
import AdminMessage from "./pages/admin/AdminMessage";
import CourseChatbot from "./pages/CourseChatbot";
import NotificationBell from "./pages/notificationBells";





export default function App() {
  const { user } = useContext(AuthContext);

  console.log("USER FROM CONTEXT =", user);  // ⬅️ ADD THIS HERE

  const isAdmin = user?.role === "admin";


  return (
    <div>
      {/* 🌼 All Routes (No Navbar Now) */}
      <main style={{ padding: 12 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/course/:id" element={<CoursePage />} />
          <Route path="/contact-us" element={<ContactUs user={user} />} />
          <Route path="/CourseChatbot" element={<CourseChatbot />} />
          <Route
  path="/notifications"
  element={
    user ? (
      <NotificationBell userId={user.id} />
    ) : (
      <Navigate to="/login" />
    )
  }
/>






          {/* Profile – requires login */}
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

          {/* Admin Protected Routes */}
          {isAdmin ? (
            <>
              <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/subcategories" element={<SubCategories />} />
              <Route path="/admin/courses" element={<Courses />} />
              <Route path="/admin/lessons" element={<Lessons />} />
              <Route path="/admin/AdminMessage" element={ <AdminMessage />} />

            </>
          ) : (
            <Route path="/admin/*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </main>
    </div>
  );
}
