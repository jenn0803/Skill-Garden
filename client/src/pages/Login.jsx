import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css"; // ensure correct path

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const validateForm = () => {
    let newErrors = {};
    if (activeTab === "register") {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!validateEmail(form.email)) newErrors.email = "Enter a valid email address";
      if (!validatePassword(form.password))
        newErrors.password = "Password must be 8+ chars, include uppercase, number & special char";
    } else {
      if (!form.email.trim()) newErrors.email = "Email is required";
      if (!form.password.trim()) newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url =
        activeTab === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/signup";

      const { data } = await axios.post(url, form);

      if (activeTab === "login") {
        localStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const userData = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        };
        setUser(userData);
        navigate(userData.role === "admin" ? "/admin/AdminDashboard" : "/");
      } else {
        alert(data.msg || "Registered successfully! Please login.");
        setActiveTab("login");
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userData = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
      setUser(userData);
      navigate(userData.role === "admin" ? "/admin" : "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-page">
      <div className="wave" aria-hidden="true"></div>
      <div className="wave wave2" aria-hidden="true"></div>
      <div className="wave wave3" aria-hidden="true"></div>

      <div className="login-box" role="main" aria-label="Login Box">
        <h1 className="login-title">SkillGarden 💜</h1>

        <div className="tabs" role="tablist" aria-label="Login or Register">
          <button
            role="tab"
            aria-selected={activeTab === "login"}
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => {
              setActiveTab("login");
              setErrors({});
            }}
          >
            Login
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "register"}
            className={activeTab === "register" ? "tab active" : "tab"}
            onClick={() => {
              setActiveTab("register");
              setErrors({});
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form" noValidate>
          {activeTab === "register" && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="login-input"
                aria-label="Name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="login-input"
            aria-label="Email"
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="login-input"
            aria-label="Password"
          />
          {errors.password && <span className="error">{errors.password}</span>}

          <button type="submit" className="login-btn">
            {activeTab === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="google-box">
          <p>Or continue with Google</p>
          <a href="http://localhost:5000/api/auth/google" className="google-btn">
            Login with Google
          </a>
        </div>
      </div>
    </div>
  );
}
