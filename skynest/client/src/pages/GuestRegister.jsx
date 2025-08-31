import React, { useState } from "react";
import { registerGuest } from "../api/guestApi";
import { Link, useNavigate } from "react-router-dom";

export default function GuestRegister() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [hover, setHover] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const res = await registerGuest(form.username, form.password);

    if (res.error) {
      setMessage(res.error);
    } else {
      setMessage("✅ Registration successful!");
      setForm({ username: "", password: "" });

      // Redirect to login after success
      setTimeout(() => {
        navigate("/guest-login");
      }, 1500);
    }

    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      <div
        style={{ ...styles.card, ...(hover ? styles.cardHover : {}) }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <h2 style={styles.heading}>Guest Registration</h2>
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
            {isLoading ? "Registering..." : "Register"}
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
          Already have an account?{" "}
          <Link to="/guest-login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
    padding: "1rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 25px rgba(0,0,0,0.3)",
  },
  heading: {
    marginBottom: "1.5rem",
    color: "#003366",
    fontSize: "1.8rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "0.8rem",
    marginBottom: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "0.8rem",
    backgroundColor: "#003366",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "1rem",
    fontSize: "1rem",
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  message: {
    marginTop: "1rem",
    fontWeight: "500",
    padding: "0.5rem",
    borderRadius: "5px",
  },
  successMessage: {
    color: "#2ecc71",
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  errorMessage: {
    color: "#e74c3c",
    backgroundColor: "rgba(231, 76, 60, 0.1)",
  },
  loginLink: {
    marginTop: "1.5rem",
    color: "#666",
    fontSize: "0.9rem",
  },
  link: {
    color: "#003366",
    textDecoration: "none",
    fontWeight: "bold",
  }
};
