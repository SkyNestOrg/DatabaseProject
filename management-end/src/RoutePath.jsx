import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Report1 from "./pages/Report1.jsx";
import Report2 from "./pages/Report2.jsx";
import Report3 from "./pages/Report3.jsx";
import Report4 from "./pages/Report4.jsx";
import Report5 from "./pages/Report5.jsx";

export default function AppRoutes() {

  return (
    <Router>
      <Routes>
        <Route path="/managementlogin" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/managementdashboard" element={<Dashboard/>}/>   
        <Route path="/report1" element={<Report1/>}/> 
        <Route path="/report2" element={<Report2/>}/> 
        <Route path="/report3" element={<Report3/>}/>   
        <Route path="/report4" element={<Report4/>}/> 
        <Route path="/report5" element={<Report5/>}/> 
        
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );

 
}

