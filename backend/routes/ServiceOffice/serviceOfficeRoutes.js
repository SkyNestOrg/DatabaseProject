import express from "express";
import { authenticateToken } from "./middleware/authmiddleware.js";
import { login } from "./ServiceLogin.js";
import { getDashboardStats } from "./serviceOfficeDashboardStat.js";
import { getDueService } from "./serviceOfficeDueServices.js";
import { updateServiceStatus } from "./serviceOfficeUpdateService.js";
import { getServiceHistory } from "./serviceOfficeServiceHistory.js";

const router = express.Router();

router.post("/login", login); // when server receives a post request at /login,
// it will call the login function from controller

router.get("/dashboard", authenticateToken, getDashboardStats); // add authenticateToken to this so only jwt staffs can access
router.get("/requests", authenticateToken, getDueService); // to fetch all the service requests  (authenticateToken)
router.put("/requests/:id", authenticateToken, updateServiceStatus); // update service request details by id
router.get("/history", authenticateToken, getServiceHistory); // to fetch all the past service history

export default router;
