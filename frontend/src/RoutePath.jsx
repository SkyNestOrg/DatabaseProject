import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login.jsx";

// Guest (use actual filenames under Guest/src/pages)
import GuestDashboard from "./Guest/src/pages/Dashboard.jsx";
import GuestProfile from "./Guest/src/pages/profile.jsx";
import Book from "./Guest/src/pages/Book.jsx";
import BookingHistory from "./Guest/src/pages/BookingHistory.jsx";
import Branches from "./Guest/src/pages/Branches.jsx";
import CurrentBookings from "./Guest/src/pages/CurrentBookings.jsx";
import GuestViewBill from "./Guest/src/pages/GuestViewBill.jsx";
import Register from "./Guest/src/pages/Register.jsx";
import RoomsAndServices from "./Guest/src/pages/RoomsAndServices.jsx";
import ServicePage from "./Guest/src/pages/Service.jsx";

// Management
import ManagementDashboard from "./Management/Dashboard.jsx";
import Report1 from "./Management/Report1.jsx";
import Report2 from "./Management/Report2.jsx";
import Report3 from "./Management/Report3.jsx";
import Report4 from "./Management/Report4.jsx";
import Report5 from "./Management/Report5.jsx";

// Admin
import AdminDashboard from "./Admin/Dashboard.jsx";
import AdminViewDiscounts from "./Admin/ViewDiscounts.jsx";
import AdminManageStaff from "./Admin/ManageStaff.jsx";
import AdminAddTaxes from "./Admin/AddTaxes.jsx";
import AdminViewLogs from "./Admin/ViewLogs.jsx";
import AdminAddDiscounts from "./Admin/AddDiscounts.jsx";
import AdminViewTaxes from "./Admin/ViewTaxes.jsx";
import ManageStaffCreate from "./Admin/ManageStaffCreate.jsx";
import ManageStaffEdit from "./Admin/ManageStaffEdit.jsx";

// Service Office
import ServiceOfficeDashboard from "./ServiceOffice/Dashboard.jsx";
import ServiceOfficeDueServices from "./ServiceOffice/ViewDueServices.jsx";
import ServiceOfficeServiceHistory from "./ServiceOffice/ViewPastServices.jsx";
import ServiceOfficeServiceManagement from "./ServiceOffice/UpdateServiceTable.jsx";

// FrontDesk office

import Dashboard from "./FrontDeskOffice/Dashboard.jsx"; 
import Check from './FrontDeskOffice/Check.jsx';
import Payment from './FrontDeskOffice/Payment.jsx';
import SearchGuestDetails from "./FrontDeskOffice/SearchDetails.jsx";


// add dev import check route
import DevImportCheck from './DevImportCheck.jsx';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Root / Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Guest routes (aligned with files) */}
        <Route path="/guest" element={<GuestDashboard />} />
        <Route path="/guest/profile" element={<GuestProfile />} />
        <Route path="/guest/book" element={<Book />} />
        <Route path="/guest/booking-history" element={<BookingHistory />} />
        <Route path="/guest/branches" element={<Branches />} />
        <Route path="/guest/current-bookings" element={<CurrentBookings />} />
        <Route path="/guest/view-bill" element={<GuestViewBill />} />
        <Route path="/guest/register" element={<Register />} />
        <Route path="/guest/rooms-services" element={<RoomsAndServices />} />
        <Route path="/guest/service" element={<ServicePage />} />

        {/* Management routes */}
        <Route path="/management" element={<ManagementDashboard />} />
        <Route path="/management/report1" element={<Report1 />} />
        <Route path="/management/report2" element={<Report2 />} />
        <Route path="/management/report3" element={<Report3 />} />
        <Route path="/management/report4" element={<Report4 />} />
        <Route path="/management/report5" element={<Report5 />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/discounts" element={<AdminViewDiscounts />} />
        <Route path="/admin/add-discounts" element={<AdminAddDiscounts />} />
        <Route path="/admin/add-discounts/:id" element={<AdminAddDiscounts />} />
        <Route path="/admin/taxes" element={<AdminViewTaxes />} />
        <Route path="/admin/add-taxes" element={<AdminAddTaxes />} />
        <Route path="/admin/add-taxes/:id" element={<AdminAddTaxes />} />
        <Route path="/admin/manage-staff" element={<AdminManageStaff />} />
        <Route path="/admin/manage-staff/create" element={<ManageStaffCreate />} />
        <Route path="/admin/manage-staff/edit/:username" element={<ManageStaffEdit />} />
        <Route path="/admin/logs" element={<AdminViewLogs />} />

        {/* Service Office routes */}
        <Route path="/service" element={<ServiceOfficeDashboard />} />
        <Route path="/service/due" element={<ServiceOfficeDueServices />} />
        <Route path="/service/history" element={<ServiceOfficeServiceHistory />} />
        <Route path="/service/manage" element={<ServiceOfficeServiceManagement />} />

        <Route path="/frontdesk" element={<Dashboard />} />
        <Route path="/frontdesk/dashboard" element={<Dashboard />} />
        <Route path="/frontdesk/check" element={<Check />} />
        <Route path="/frontdesk/payment" element={<Payment />} />
        <Route path="/frontdesk/searchguestdetails" element={<SearchGuestDetails />} />

        {/* Dev: import check */}
        <Route path="/dev-import-check" element={<DevImportCheck />} />

        <Route path="*" element={<div style={{ padding: 20 }}>Not found</div>} />
      </Routes>
    </Router>
  );
}

// Yohan Functional component export for RoutePath.jsx
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Login from "./Login.jsx";

// // Guest (use actual filenames under Guest/src/pages)
// import GuestDashboard from "./Guest/src/pages/Dashboard.jsx";
// import GuestProfile from "./Guest/src/pages/profile.jsx";
// import Book from "./Guest/src/pages/Book.jsx";
// import BookingHistory from "./Guest/src/pages/BookingHistory.jsx";
// import Branches from "./Guest/src/pages/Branches.jsx";
// import CurrentBookings from "./Guest/src/pages/CurrentBookings.jsx";
// import GuestViewBill from "./Guest/src/pages/GuestViewBill.jsx";
// import Register from "./Guest/src/pages/Register.jsx";
// import RoomsAndServices from "./Guest/src/pages/RoomsAndServices.jsx";
// import ServicePage from "./Guest/src/pages/Service.jsx";

// // Management
// import ManagementDashboard from "./Management/Dashboard.jsx";
// import Report1 from "./Management/Report1.jsx";
// import Report2 from "./Management/Report2.jsx";
// import Report3 from "./Management/Report3.jsx";
// import Report4 from "./Management/Report4.jsx";
// import Report5 from "./Management/Report5.jsx";

// // Admin
// import AdminDashboard from "./Admin/Dashboard.jsx";
// import AdminViewDiscounts from "./Admin/ViewDiscounts.jsx";
// import AdminManageStaff from "./Admin/ManageStaff.jsx";
// import AdminAddTaxes from "./Admin/AddTaxes.jsx";
// import AdminViewLogs from "./Admin/ViewLogs.jsx";
// import AdminAddDiscounts from "./Admin/AddDiscounts.jsx";
// import AdminViewTaxes from "./Admin/ViewTaxes.jsx";

// // Service Office
// import ServiceOfficeDashboard from "./ServiceOffice/Dashboard.jsx";
// import ServiceOfficeDueServices from "./ServiceOffice/ViewDueServices.jsx";
// import ServiceOfficeServiceHistory from "./ServiceOffice/ViewPastServices.jsx";
// import ServiceOfficeServiceManagement from "./ServiceOffice/UpdateServiceTable.jsx";

// // FrontDesk office
// import Dashboard from "./FrontDeskOffice/Dashboard.jsx"; // Added import for Dashboard
// import Check from './FrontDeskOffice/Check.jsx';
// import Payment from './FrontDeskOffice/Payment.jsx';
// import SearchGuestDetails from "./FrontDeskOffice/SearchDetails.jsx";

// // add dev import check route
// import DevImportCheck from './DevImportCheck.jsx';

// export default function AppRoutes() {
//   return (
//     <Router>
//       <Routes>
//         {/* Root / Login */}
//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />

//         {/* Guest routes (aligned with files) */}
//         <Route path="/guest" element={<GuestDashboard />} />
//         <Route path="/guest/profile" element={<GuestProfile />} />
//         <Route path="/guest/book" element={<Book />} />
//         <Route path="/guest/booking-history" element={<BookingHistory />} />
//         <Route path="/guest/branches" element={<Branches />} />
//         <Route path="/guest/current-bookings" element={<CurrentBookings />} />
//         <Route path="/guest/view-bill" element={<GuestViewBill />} />
//         <Route path="/guest/register" element={<Register />} />
//         <Route path="/guest/rooms-services" element={<RoomsAndServices />} />
//         <Route path="/guest/service" element={<ServicePage />} />

//         {/* Management routes */}
//         <Route path="/management" element={<ManagementDashboard />} />
//         <Route path="/management/report1" element={<Report1 />} />
//         <Route path="/management/report2" element={<Report2 />} />
//         <Route path="/management/report3" element={<Report3 />} />
//         <Route path="/management/report4" element={<Report4 />} />
//         <Route path="/management/report5" element={<Report5 />} />

//         {/* Admin routes */}
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/admin/discounts" element={<AdminViewDiscounts />} />
//         <Route path="/admin/add-discounts" element={<AdminAddDiscounts />} />
//         <Route path="/admin/taxes" element={<AdminViewTaxes />} />
//         <Route path="/admin/add-taxes" element={<AdminAddTaxes />} />
//         <Route path="/admin/manage-staff" element={<AdminManageStaff />} />
//         <Route path="/admin/logs" element={<AdminViewLogs />} />

//         {/* Service Office routes */}
//         <Route path="/service" element={<ServiceOfficeDashboard />} />
//         <Route path="/service/due" element={<ServiceOfficeDueServices />} />
//         <Route path="/service/history" element={<ServiceOfficeServiceHistory />} />
//         <Route path="/service/manage" element={<ServiceOfficeServiceManagement />} />

//         <Route path="/frontdesk" element={<Dashboard />} />
//         <Route path="/frontdesk/dashboard" element={<Dashboard />} />
//         <Route path="/frontdesk/check" element={<Check />} />
//         <Route path="/frontdesk/payment" element={<Payment />} />
//         <Route path="/frontdesk/searchguestdetails" element={<SearchGuestDetails />} />
//         {/* Dev: import check */}
//         <Route path="/dev-import-check" element={<DevImportCheck />} />

//         <Route path="*" element={<div style={{ padding: 20 }}>Not found</div>} />
//       </Routes>
//     </Router>
//   );
// }