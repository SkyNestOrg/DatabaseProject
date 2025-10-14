import express from "express";
import { authenticateToken } from "./ServiceOffice/middleware/authmiddleware.js";
import { login } from "./ServiceOffice/ServiceLogin.js";
import { getDashboardStats } from "./ServiceOffice/serviceOfficeDashboardStat.js";
import { getDueService } from "./ServiceOffice/serviceOfficeDueServices.js";
import { updateServiceStatus } from "./ServiceOffice/serviceOfficeUpdateService.js";
import { getServiceHistory } from "./ServiceOffice/serviceOfficeServiceHistory.js";

const router = express.Router();

router.post("/login", login); // when server receives a post request at /login,
// it will call the login function from controller

router.get("/dashboard", authenticateToken, getDashboardStats); // add authMiddleware to this so only jwt staffs can access
router.get("/requests", authenticateToken, getDueService); // to fetch all the service requests  (authmiddleware)
router.put("/requests/:id", authenticateToken, updateServiceStatus); // update service request details by id
router.get("/history", authenticateToken, getServiceHistory); // to fetch all the past service history

export default router;
