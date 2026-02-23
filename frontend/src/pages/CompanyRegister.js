import React, { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function CompanyRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/register-company", form);
      localStorage.setItem("token", res.data.token);
      alert("Registration successful");
      navigate("/admin/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-root">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register Company</h2>

        <input
          className="auth-input"
          placeholder="Company Name"
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />

        <input
          className="auth-input"
          placeholder="Admin Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="auth-input"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="auth-btn">Register</button>
  
        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/admin/login")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}