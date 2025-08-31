import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Footer from "../components/Footer";

// ✅ Set backend URL
const BACKEND_URL = "https://social-media-content-analyzer-imw6.onrender.com";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // ✅ Use deployed backend URL
      const res = await axios.post(`${BACKEND_URL}/auth/login`, formData);

      localStorage.setItem("token", res.data.token); // store JWT
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/upload"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Heading above box */}
      <div className="auth-heading">📄 Social Media Content Analyzer</div>

      {/* Login box */}
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Log In"}
          </button>
        </form>

        {message && (
          <p
            className={
              message.startsWith("✅") ? "success-message" : "error-message"
            }
          >
            {message}
          </p>
        )}

        <p>
          Don’t have an account?{" "}
          <Link to="/auth/signup" style={{ color: "#4cafef" }}>
            Sign up
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}
