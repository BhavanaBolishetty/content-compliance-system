import React, { useState, useRef } from "react";
import axios from "../api";

import "./MessageBox.css";

export default function MessageBox() {
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [badWord, setBadWord] = useState("");
  const [reason, setReason] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");

  const textareaRef = useRef(null);
  const handleSend = () => {
  alert(" Message sent successfully");
  setMessage("");
  setWarning("");
  setBlocked(false);
  setBadWord("");
  setReason("");
  setApprovalStatus("");
};

  const checkMessage = async (text) => {
  setMessage(text);
  setApprovalStatus("");
  if (!text.trim()) {
    setWarning("");
    setBlocked(false);
    setBadWord("");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No employee token found");
      return;
    }

    const res = await axios.post(
      "/api/check-message",
      { message: text },   
       
    );

    
    if (res.data.blocked) {
      setBlocked(true);
      setBadWord(res.data.word);
      setWarning(`⚠ Restricted word detected: "${res.data.word}"`);
    } else {
      setBlocked(false);
      setBadWord("");
      setWarning("");
    }

  } catch (err) {
    console.error(err);
  }


  
};

const requestApproval = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "/api/request-approval",
      {
        message,
        word: badWord,
        reason
      },
       
    );

    if (res.data.success) {
      setApprovalStatus("pending");
    }
  } catch (err) {
    console.error(err);
  }
};


React.useEffect(() => {
  if (!approvalStatus || approvalStatus === "approved") return;

  const interval = setInterval(async () => {
    const res = await axios.get(
      "/api/approval-status",
      {
        params: { message, word: badWord }
      }
    );

    if (res.data.status === "approved") {
      setApprovalStatus("approved");
      setBlocked(false);
      setWarning("");
      setReason("");
    }

    if (res.data.status === "rejected") {
      setApprovalStatus("rejected");
    }
  }, 3000);

  return () => clearInterval(interval);
}, [approvalStatus]);


  return (
    <div className="container">

      <textarea
        ref={textareaRef}
        className="textarea"
        value={message}
        onChange={(e) => checkMessage(e.target.value)}
      />

      <button
        disabled={
          blocked &&
          !(approvalStatus === "approved" && message.includes(badWord))
        }

        onClick={handleSend}
        >
        Send
      </button>


      {warning && (
        <div className="warning-box">

            {blocked && (
                <div className="approval-box">
                    <p className="warning">{warning}</p>

                    <textarea
                    placeholder="Explain why you need to use this word"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    />

                    <button
                    onClick={requestApproval}
                    disabled={!reason.trim()}
                    >
                    Request Approval
                    </button>
                </div>
                )}

                {approvalStatus && (
                    <p className={`status ${approvalStatus}`}>
                        {approvalStatus === "pending" && "⏳ Waiting for admin approval"}
                        {approvalStatus === "approved" && "✅ Approved – You may send"}
                        {approvalStatus === "rejected" && "❌ Request rejected"}
                    </p>
                )}


            </div>
        )}

    </div>
  );
}
