import axios from "../api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Auth.css";

export default function AdminLogin({ onLogin }) {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      onLogin(true);
      navigate("/admin");
    } catch {
      alert("Login failed");
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) navigate("/admin");
}, []);

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h2>Admin Login</h2>

        <input
          className="auth-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}