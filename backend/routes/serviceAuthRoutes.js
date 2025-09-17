import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { login } from '../controllers/authController.js';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { getDueService } from '../controllers/ServiceController.js';

const router = express.Router();

// router.post("/signup", signup); // when server receives a post request at /signup,
//                                 // it will call the signup function from controller

// router.get("/profile", authMiddleware, getProfile); // when server receives a get request at /profile,

// router.put("/update-password", authMiddleware, updatePassword);

// router.delete("/delete", authMiddleware, deleteUser);

router.post("/login", login);   // when server receives a post request at /login,
                                // it will call the login function from controller

router.get("/dashboard", getDashboardStats);  // add authMiddleware to this so only jwt staffs can access
router.get("/requests", getDueService); // to fetch all the service requests  (authmiddleware)
router.put("/requests/:id", authMiddleware, getServiceDetails); // update service request details by id
// router.get("/history", authMiddleware, getServiceHistory); // to fetch all the past service history


export default router;