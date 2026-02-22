import React, { useState } from "react";
import MessageBox from "../components/MessageBox";
import EmployeeLogin from "./EmployeeLogin";

export default function Employee() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <EmployeeLogin onLogin={setLoggedIn} />;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Employee Portal</h2>
      <MessageBox />
    </div>
  );
}
