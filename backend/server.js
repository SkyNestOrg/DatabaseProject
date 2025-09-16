// index.js (ESM version)
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Importing routes
import serviceAuthRoutes from './routes/serviceAuthRoutes.js';

// importing middlewares
import { authMiddleware } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // replaces body-parser.urlencoded()

// guest routes (ESM style import instead of require)
// eg: import customerLogin from "./routes/Customer/Login.js";
//     app.use("/signin", customerLogin);

//service office routes
app.use("/service", serviceAuthRoutes);  // all routes in serviceAuthRoutes will be prefixed with /service


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

