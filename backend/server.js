import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();


app.use(cors());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.json());


//common routes
import TokenAuth from './routes/TokenAuth.js';
app.use('/tokenauth', TokenAuth);


// guest routes (ESM style import instead of require)
import GuestRegister from "./routes/Guest/GuestRegister.js";
app.use("/register", GuestRegister);
import GuestLogin from "./routes/Guest/GuestLogin.js";
app.use("/login", GuestLogin);
import GuestTokenAuth from "./routes/Guest/GuestTokenAuth.js";
app.use("/guesttokenauth", GuestTokenAuth );
import GuestProfile from "./routes/Guest/GuestProfile.js";
app.use("/guest", GuestProfile);
import OurBranches from "./routes/Guest/OurBranches.js";
app.use("/branches", OurBranches);
import RoomsAndServices from './routes/Guest/RoomsAndServices.js'; 
app.use('/roomsandservices',RoomsAndServices);
import GuestBook from './routes/Guest/GuestBook.js'; 
app.use('/book',GuestBook);
import getbranches from './routes/Guest/GetBranches.js'; 
app.use('/getbranches', getbranches);  
import getroomtypes from './routes/Guest/GetRoomType.js'; 
app.use('/getroomtypes', getroomtypes); 
import GuestService from './routes/Guest/GuestService.js'; 
app.use('/guestservice', GuestService);
import GetServices from './routes/Guest/GetServices.js'; 
app.use('/getservices', GetServices);
import GetRooms from './routes/Guest/GetRooms.js'; 
app.use('/getrooms', GetRooms);
import CurrentBookings from './routes/Guest/CurrentBookings.js'; 
app.use('/currentbookings', CurrentBookings);
import GuestViewBill from './routes/Guest/GuestViewBill.js'; 
app.use('/bill', GuestViewBill);





//service office routes
import ServiceLogin from "./routes/ServiceOffice/ServiceLogin.js";
app.use("/serviceofficelogin", ServiceLogin);
import ServiceOfficeTokenAuth from "./routes/ServiceOffice/ServiceOfficeTokenAuth.js";
app.use("/serviceofficetokenauth", ServiceOfficeTokenAuth );




//front desk office routes
// import FrontOfficeLogin from "./routes/FrontDesk/FrontOfficeLogin.js";
// app.use("/frontofficelogin", FrontOfficeLogin);
// import FrontOfficeTokenAuth from "./routes/FrontDesk/FrontOfficeTokenAuth.js";
// app.use("/frontofficetokenauth", FrontOfficeTokenAuth );

import FrontOfficeLogin from "./routes/FrontDesk/FrontOfficeLogin.js";
app.use("/frontdesklogin", FrontOfficeLogin);

import FrontOfficeTokenAuth from "./routes/FrontDesk/FrontOfficeTokenAuth.js";
app.use("/frontofficetokenauth", FrontOfficeTokenAuth);

// Booking Management (Front Desk)
import FrontDeskBooking from "./routes/FrontDesk/BookingHandle.js"; // includes create/cancel bookings
app.use("/frontdesk/api/booking", FrontDeskBooking);


// Check-in and Check-out
import CheckIn from "./routes/FrontDesk/CheckIn.js";
app.use("/frontdesk/checkin", CheckIn);

import CheckOut from "./routes/FrontDesk/CheckOut.js";
app.use("/frontdesk/checkout", CheckOut);

// **NEW: Booking Details endpoint for Check In/Out page**
import FetchDetails from "./routes/FrontDesk/FetchDetails.js"; // ✅ CORRECT NAME
app.use("/frontdesk/fetch", FetchDetails); // ✅ CORRECT ROUTE

// Payments
import PaymentAndBill from "./routes/FrontDesk/Payement_and_Bill.js"; // includes makePayment, cancelPayment, view bills
app.use("/frontdesk/api/payments", PaymentAndBill);







//management routes
import ManagementLogin from "./routes/Management/ManagamentLogin.js";
app.use("/managementlogin", ManagementLogin);
import ManagementTokenAuth from "./routes/Management/ManagementTokenAuth.js";
app.use("/managementtokenauth", ManagementTokenAuth );




//admin routes
import AdminLogin from "./routes/Admin/AdminLogin.js";
app.use("/adminlogin", AdminLogin);
import AdminTokenAuth from "./routes/Admin/AdminTokenAuth.js";
app.use("/admintokenauth", AdminTokenAuth );

import AddTaxes from "./routes/Admin/AddTaxes.js";
app.use("/addtaxes", AddTaxes );
import AddDiscounts from "./routes/Admin/AddDiscounts.js";
app.use("/adddiscounts", AddDiscounts );
import ViewDiscounts from "./routes/Admin/ViewDiscounts.js";
app.use("/viewdiscounts", ViewDiscounts );
import ViewTaxes from "./routes/Admin/ViewTaxes.js";
app.use("/viewtaxes", ViewTaxes );
import ManageStaff from "./routes/Admin/ManageStaff.js";
app.use("/managestaff", ManageStaff );
import ViewLogs from "./routes/Admin/ViewLogs.js";
app.use("/viewlogs", ViewLogs );




// Example route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});


// Start the server and make it listen for requests
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
});

