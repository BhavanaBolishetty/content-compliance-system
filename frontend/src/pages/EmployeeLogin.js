import axios from "../api";
import { useState } from "react";
import "./Auth.css";

export default function EmployeeLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      onLogin(true);
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <h2>Employee Login</h2>

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