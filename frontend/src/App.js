import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "./pages/Admin";   
import AdminLogin from "./pages/AdminLogin";
import Employee from "./pages/Employee";
import CompanyRegister from "./pages/CompanyRegister";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CompanyRegister />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={
        localStorage.getItem("token") ? <Admin /> : <Navigate to="/admin/login" />} />
      <Route path="/employee" element={<Employee />} />        

    </Routes>
  );
}

export default App;
