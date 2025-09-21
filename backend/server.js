// index.js (ESM version)
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";


const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // replaces body-parser.urlencoded()


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

//service office routes

//front desk office routes

//management routes

//admin routes





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

