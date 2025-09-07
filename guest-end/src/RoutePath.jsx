import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { useEffect, useState } from "react";
//import login from "./PersistentLogin"; // Commented out for now

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// ===== COMMENTED OUT - OTHER LAYOUTS & COMPONENTS =====
 import FullLayout from "./layout/FullLayout";

// ===== COMMENTED OUT - ALL OTHER PAGES =====
// import Dashboard from './pages/Dashboard';
// import Reports from './pages/Reports';
// import NotFound from './pages/NotFound';
// import ProcessingOrders from './pages/ProcessingOrders';
// import Pend ingOrders from './pages/PendingOrders';
// import TrainTrips from './pages/TrainTrips';
// import SelectSchedule from './pages/SelectSchedule';
// import ScheduleHistory from './pages/ScheduleHistory';
// import ProductsByCategory from './pages/AddProducts';
// import AddDriver from './pages/AddDriver';
// import AddDriverAssistant from './pages/AddDriverAssistant';
// import ProfilePage from "./pages/Profile";
// import WorkingHours from "./pages/WorkingHours";
// import TrucksWorkingHours from "./pages/TrucksWorkingHours";
// import LogIn from "./pages/LogIn";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";

export default function AppRoutes() {
  // ===== COMMENTED OUT - LOGIN CHECK LOGIC =====
  //  const [loginInfo, setLoginInfo] = useState(null);

  // useEffect(() => {
  //   async function fetchLoginInfo() {
  //     const info = await login();
  //     setLoginInfo(info);
  //   }
  //   fetchLoginInfo();
  // }, []);

 

  
  return (
    <Router>
      <Routes>
        {/* Active Route - Guest Registration */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Register />} /> {/* Default route */}
        <Route path="/guestdashboard" element = {<Dashboard/>}/>
        
        {/* ===== COMMENTED OUT - LOGIN ROUTES ===== */}
        <Route path="/login" element={<Login />} />  
        
        {/* ===== COMMENTED OUT - ALL OTHER ROUTES ===== */}
        {/* Routes using FullLayout */}
        {/* <Route element={<FullLayout />}> */}
        {/*   <Route path="/dashboard" element={<Dashboard />} /> */}
        {/*   <Route path="/profile" element={<ProfilePage />} /> */}
        {/*   <Route path="/reports" element={<Reports />} /> */}
        {/*   
        {/*   {loginInfo.role === "admin" && ( */}
        {/*     <> */}
        {/*       <Route path="/orders" element={<PendingOrders />} /> */}
        {/*       <Route path="/orders"> */}
        {/*         <Route path="traintrips" element={<TrainTrips />} /> */}
        {/*       </Route> */}
        {/*       <Route path="/products" element={<ProductsByCategory />} /> */}
        {/*     </> */}
        {/*   )} */}
        {/*   
        {/*   {loginInfo.role === "manager" && ( */}
        {/*     <> */}
        {/*       <Route path="/orders" element={<ProcessingOrders />} /> */}
        {/*       <Route path="/orders"> */}
        {/*         <Route path="truck-schedules" element={<SelectSchedule />} /> */}
        {/*       </Route> */}
        {/*       <Route path="/addDriver" element={<AddDriver />} /> */}
        {/*       <Route path="/addAssistant" element={<AddDriverAssistant />} /> */}
        {/*       <Route path="/viewWorkingHours" element={<WorkingHours />} /> */}
        {/*       <Route path="/schedule-history" element={<ScheduleHistory />} /> */}
        {/*       <Route path="/trucksWorkingHours" element={<TrucksWorkingHours />} /> */}
        {/*     </> */}
        {/*   )} */}
        {/* </Route> */}
        
        {/* Routes without FullLayout
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />  */}
        {/* <Route path="/notfound" element={<NotFound />} />  */}
        
        {/* Catch-all route - for now redirects to register*/}
        <Route path="*" element={<Register />} />
      </Routes>
    </Router>
  );

  // ===== COMMENTED OUT - ORIGINAL LOGIN-BASED ROUTING LOGIC =====
  /*
  if (!loginInfo) {
    return (
      <div>
        <div>Loading...</div>
      </div>
    );
  } else if (loginInfo && !loginInfo.success) {
    return (
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="*" element={<Register />} />
        </Routes>
      </Router>
    );
  } else {
    return (
      <Router>
        <Routes>
          <Route element={<FullLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reports" element={<Reports />} />
            {loginInfo.role === "admin" && (
              <>
                <Route path="/orders" element={<PendingOrders />} />
                <Route path="/orders">
                  <Route path="traintrips" element={<TrainTrips />} />
                </Route>
                <Route path="/products" element={<ProductsByCategory />} />
              </>
            )}
            {loginInfo.role === "manager" && (
              <>
                <Route path="/orders" element={<ProcessingOrders />} />
                <Route path="/orders">
                  <Route path="truck-schedules" element={<SelectSchedule />} />
                </Route>
                <Route path="/addDriver" element={<AddDriver />} />
                <Route path="/addAssistant" element={<AddDriverAssistant />} />
                <Route path="/viewWorkingHours" element={<WorkingHours />} />
                <Route path="/schedule-history" element={<ScheduleHistory />} />
                <Route path="/trucksWorkingHours" element={<TrucksWorkingHours />} />
              </>
            )}
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }
  */
}