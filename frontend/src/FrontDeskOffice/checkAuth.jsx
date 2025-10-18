import axios from "axios";

const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { success: false };

    const res = await axios.get("/frontdesk/api/verify", {
      headers: { "x-access-token": token },
    });

    return res.data;
  } catch (err) {
    console.error("Auth check failed:", err);
    return { success: false };
  }
};

export default checkAuth;
