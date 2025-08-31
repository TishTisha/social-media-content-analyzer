import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import Footer from "../components/Footer";

// ✅ Set backend URL
const BACKEND_URL = "https://social-media-content-analyzer-imw6.onrender.com";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use deployed backend URL
      const res = await axios.post(`${BACKEND_URL}/auth/signup`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMessage("✅ Signup successful! Redirecting...");
      setTimeout(() => navigate("/upload"), 1000);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Signup failed"));
    }
  };

  return (
    <div className="auth-page">
      {/* Heading above box */}
      <div className="auth-heading">📄 Social Media Content Analyzer</div>

      {/* Auth box */}
      <div className="auth-box">
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={
              message.startsWith("✅") ? "success-message" : "error-message"
            }
          >
            {message}
          </p>
        )}

        {/* Already have an account link */}
        <p>
          Already have an account?{" "}
          <Link to="/auth/login" style={{ color: "#4cafef" }}>
            Login
          </Link>
        </p>
      </div>

      <Footer />
    </div>
  );
}
