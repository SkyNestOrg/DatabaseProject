import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { useEffect, useState } from "react";
//import login from "./PersistentLogin"; // Commented out for now

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GuestProfile from "./pages/profile";
import Branches from "./pages/Branches"; 
import RoomsAndServices from "./pages/RoomsAndServices";
// ===== COMMENTED OUT - OTHER LAYOUTS & COMPONENTS =====
import FullLayout from "./layout/FullLayout";
import Book from "./pages/Book";
import GuestService from "./pages/Service";
import CurrentBookings from "./pages/CurrentBookings";
import GuestViewBill from "./pages/GuestViewBill";


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
        <Route path="/guestdashboard" element={<Dashboard/>}/>
        <Route path="/guest-profile" element={<GuestProfile/>}/>
        <Route path="/branches" element={<Branches/>}/> {/* Added Branches route */}
        <Route path = "/roomsandservices" element = {<RoomsAndServices/>} />
        <Route path = "/book" element = {<Book/>} />
        <Route path = "/guestservice" element = {<GuestService/>} />
        <Route path = "/currentbookings" element = {<CurrentBookings/>} />
        <Route path = "/bill" element = {<GuestViewBill/>} />
        
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