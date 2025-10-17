import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Login from "./Login.jsx";
import ManagementDashboard from "./Management/Dashboard.jsx";
import Report1 from "./Management/Report1.jsx";
import Report2 from "./Management/Report2.jsx";
import Report3 from "./Management/Report3.jsx";
import Report4 from "./Management/Report4.jsx";
import Report5 from "./Management/Report5.jsx";

import AdminDashboard from "./Admin/Dashboard.jsx";
import AdminViewDiscounts from "./Admin/ViewDiscounts.jsx";
import AdminManageStaff from "./Admin/ManageStaff.jsx";
import AdminAddTaxes from "./Admin/AddTaxes.jsx";
import AdminViewLogs from "./Admin/ViewLogs.jsx";
import AdminAddDiscounts from "./Admin/AddDiscounts.jsx";
import AdminViewTaxes from "./Admin/ViewTaxes.jsx";

export default function AppRoutes() {

  return (
    <Router>
      <Routes>
        <Route path="/managementlogin" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Default route */}

        {/* Management dashboard with nested management pages */}
        <Route path="/managementdashboard" element={<ManagementDashboard/>}>
          <Route index element={<div />} />
          <Route path="report1" element={<Report1/>} />
          <Route path="report2" element={<Report2/>} />
          <Route path="report3" element={<Report3/>} />
          <Route path="report4" element={<Report4/>} />
          <Route path="report5" element={<Report5/>} />
        </Route>

        {/* Admin dashboard with nested admin pages */}
        <Route path="/admindashboard" element={<AdminDashboard/>}>
          <Route index element={<div />} />
          <Route path="viewdiscounts" element={<AdminViewDiscounts/>} />
          <Route path="managestaff" element={<AdminManageStaff/>} />
          <Route path="addtaxes" element={<AdminAddTaxes/>} />
          <Route path="adddiscounts" element={<AdminAddDiscounts/>} />
          <Route path="viewtaxes" element={<AdminViewTaxes/>} />
          <Route path="viewlogs" element={<AdminViewLogs/>} />
        </Route>

        {/* Legacy direct report routes (optional redirects) */}
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

