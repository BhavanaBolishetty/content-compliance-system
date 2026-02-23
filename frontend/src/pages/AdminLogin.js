import axios from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function AdminLogin() {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      
      window.location.href ="/admin";
    } catch {
      alert("Login failed");
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) navigate("/admin");
 }, [navigate]);

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