import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json"
  }
});

// Register staff
export const registerStaff = (data) => API.post("/register/", data);

// Fetch all staff
export const getStaff = () => API.get("/staff/");

// Delete staff
export const deleteStaff = (username) => API.delete(`/staff/${username}`);

export const fetchBranches = () => API.get("/branches");
export const createStaff = (staffData) => API.post("/staff", staffData);
export const fetchStaff = () => API.get("/staff");