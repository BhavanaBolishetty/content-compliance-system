
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Shield, User} from "lucide-react";
import { Ban, PlusCircle, CheckCircle } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { MessageSquare, AlertCircle, Info, BadgeCheck } from "lucide-react";
import { Mail, Lock, Send } from "lucide-react";
import { Building2, Hash, LogOut } from "lucide-react";
import axios from "../api";
import AdminLogin from "./AdminLogin";
import "./Admin.css";
import "./Auth.css";
export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);
  
  const [requests, setRequests] = useState([]);
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("words");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [companyName, setCompanyName] = useState("");

  const [empForm, setEmpForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  /* ================= FETCH WORDS ================= */
  const fetchWords = async () => {
    try {
      const res = await axios.get("/api/restricted-words");
      setWords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH APPROVALS ================= */
  const fetchRequests = async () => {
    try {
      const res = await axios.get("/api/approvals");

      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRequests(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= APPROVE / REJECT ================= */
  const handleAction = async (id, action) => {
    try {
      await axios.post(
        `/api/approvals/${id}/${action}`,
        {} );
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Unauthorized. Please login again.");
    }
  };

  /* ================= DELETE WORD ================= */
  const handleDelete = async (id) => {
    await axios.delete(`/api/restricted-words/${id}`);
    alert("Word Deleted")
    fetchWords();
  };

  /* ================= EDIT WORD ================= */
  const handleEdit = async (id, oldWord) => {
    const updated = prompt("Edit word:", oldWord);
    if (!updated) return;

    await axios.put(
      `/api/restricted-words/${id}`,
      { word: updated } );
      alert("Word Updated")
    fetchWords();
  };

  /* ================= INIT ================= */
  useEffect(() => {
    if (!loggedIn) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    setCompanyName(decoded.companyName);
    setEmail(decoded.email);
    fetchWords();
    fetchRequests();

    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);

  }, [loggedIn]);

  /* ================= LOGIN RENDER ================= */
  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  /* ================= UI ================= */
  return (
  <div className="admin-root">

    {/* ===== NAVBAR ===== */}
    <div className="navbar">

      <div className="nav-left">
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={28} />
        </div>

        <h3 className="nav-title">
          <Shield size={22} />Admin Panel
        </h3>
      </div>
      
      {/* PROFILE */}
      <div className="profile-wrapper">
      
        <div
          className="profile-circle"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          {companyName?.charAt(0)}
          
        </div>

        {profileOpen && (
          <div className="profile-dropdown">

            <p><Building2 size={18}/><b>{companyName}</b></p>
            <hr />

            <p onClick={() => { setActiveTab("profile"); setProfileOpen(false); }}>
            <User size={18}/> Profile
            </p>

            <p onClick={() => { setActiveTab("invite"); setProfileOpen(false); }}>
            <Send size={18}/> Invite Employee
            </p>

            <p
              className="logout"
              onClick={() => {
                localStorage.removeItem("token");
                setLoggedIn(false);
              }}
            ><LogOut size={18}/> Logout
            </p>

          </div>
        )}
      </div>
    </div>

    {/* ===== MAIN ===== */}
    <div className="main">

      {/* SIDEBAR */}
      {menuOpen && (
        <div className="sidebar">

          <p onClick={() => { setActiveTab("words"); setMenuOpen(false); }}>
            <Ban size={26}/> Restricted Words
          </p>

          <p onClick={() => { setActiveTab("add"); setMenuOpen(false); }}>
            <PlusCircle size={26} /> Add Word
          </p>

          <p onClick={() => { setActiveTab("approvals"); setMenuOpen(false); }}>
            <CheckCircle size={26} /> Approvals
          </p>

        </div>
      )}

      {/* CONTENT */}
      <div className="content">

        {/* WORDS */}
        {activeTab === "words" && (
          <>
            <h2>Restricted Words</h2>

            <input
              className="search-box"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {words
              .filter(w => w.word.toLowerCase().includes(search.toLowerCase()))
              .map(w => (
                <div key={w._id} className="card">

                  <span>{w.word}</span>

                  <div className="action-buttons">
                    <button onClick={() => handleEdit(w._id, w.word)}><Pencil size={16} /> </button>

                    <button onClick={() => handleDelete(w._id)}><Trash2 size={16}/> </button>
                  </div>

                </div>
              ))}
          </>
        )}

        {/* ADD WORD */}
        {activeTab === "add" && (
          <>
            <h2>Add Word</h2>

            <input
              className="input-field"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />

            <button disabled={!newWord.trim()}
              onClick={async () => {
                try{
                await axios.post(
                  "/api/restricted-words", {word: newWord.trim()});
                  alert("Word Added")
                  setNewWord("");
                  fetchWords();
                }catch(err){
                if (err.response?.status === 409) {
                  alert("Word already exists");
                } else {
                  alert("Error adding word");
                }}

              }}
            >
              Add
            </button>
          </>
        )}

        {/* APPROVALS */}
        {activeTab === "approvals" && (
          <div>

            <h2>Approval Requests</h2>

            {requests.length === 0 && <p>No approval requests yet</p>}

            {requests.map((r) => (
              <div key={r._id} className="approval-card">

                <p><User size={16}/> <strong>Employee Email:</strong> {r.employeeId?.email}</p>
                <p><MessageSquare size={16}/><strong>Message:</strong> {r.message}</p>
                <p><AlertCircle size={16}/><strong>Restricted Word:</strong> {r.detectedWord}</p>
                <p><Info size={16}/><strong>Reason:</strong> {r.reason}</p>

                <p><BadgeCheck size={16}/>
                  <strong>Status:</strong>{" "}
                  <span className={`status-pill status-${r.status}`}>
                    {r.status}
                  </span>
                </p>

                {r.status === "pending" && (
                  <div className="action-buttons">

                    <button
                      className="approve-btn"
                      onClick={() => handleAction(r._id, "approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => handleAction(r._id, "rejected")}
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>
            ))}
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <><h2><User size={28}/>
            Profile</h2>
            <p><Building2 size={18}/>
           <b> Company: </b>{companyName}</p>
            <p><Mail size={18}/>
           <b> Email:</b> {email}</p>
          </>
        )}

        {/* INVITE */}
        {activeTab === "invite" && (
          <>
            <h2>Invite Employee</h2>
           < User size={18} />
            <input
              className="input-field"
              placeholder="Name"
              value={empForm.name}
              onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
            />

            <Mail size={18}/>
            <input
              className="input-field"
              placeholder="Email"
              value={empForm.email}
              onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
            />

            <Lock size={18}/>
            <input 
              className="input-field"
              type="password"
              placeholder="Password"
              value={empForm.password}
              onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })}
            />

            <button
              onClick={async () => {
                await axios.post("/api/invite-employee", empForm); 
                alert("Invited");
              }}
            >
              <Send size={18}/> Invite
            </button>
          </>
        )}

      </div>
    </div>
  </div>
);
}