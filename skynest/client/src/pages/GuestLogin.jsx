import React, { useState } from "react";
import { loginGuest } from "../api/guestApi";
import { Link, useNavigate } from "react-router-dom";

export default function GuestLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setMessage("");

  const res = await loginGuest(form.username, form.password);

  if (res.error) {
    setMessage(res.error);
  } else {
    setMessage("✅ Login successful!");
    setForm({ username: "", password: "" });

    // Save token + guestId
    localStorage.setItem("token", res.token);
    localStorage.setItem("guestId", res.guestId);

    // Redirect to My Account
    setTimeout(() => {
      navigate("/my-account");
    }, 1000);
  }

  setIsLoading(false);
};


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Guest Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button 
            type="submit" 
            style={{...styles.button, ...(isLoading ? styles.buttonLoading : {})}}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p style={{
            ...styles.message,
            ...(message.includes("✅") ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </p>
        )}
        <p style={styles.loginLink}>
          Don't have an account?{" "}
          <Link to="/guest-register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}





const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", padding: "1rem" },
  card: { backgroundColor: "#fff", padding: "2rem", borderRadius: "15px", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", width: "100%", maxWidth: "400px", textAlign: "center" },
  heading: { marginBottom: "1.5rem", color: "#003366", fontSize: "1.8rem" },
  form: { display: "flex", flexDirection: "column" },
  input: { padding: "0.8rem", marginBottom: "1rem", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem", outline: "none" },
  button: { padding: "0.8rem", backgroundColor: "#003366", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s ease", marginBottom: "1rem", fontSize: "1rem" },
  buttonLoading: { opacity: 0.7, cursor: "not-allowed" },
  message: { marginTop: "1rem", fontWeight: "500", padding: "0.5rem", borderRadius: "5px" },
  successMessage: { color: "#2ecc71", backgroundColor: "rgba(46, 204, 113, 0.1)" },
  errorMessage: { color: "#e74c3c", backgroundColor: "rgba(231, 76, 60, 0.1)" },
  loginLink: { marginTop: "1.5rem", color: "#666", fontSize: "0.9rem" },
  link: { color: "#003366", textDecoration: "none", fontWeight: "bold" }
};
