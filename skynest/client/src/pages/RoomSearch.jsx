import React, { useState } from "react";
import { searchRooms } from "../api/roomApi";

export default function RoomSearch() {
  const [form, setForm] = useState({
  branch: "",
  roomType: "",
  checkIn: "",
  checkOut: ""
});
;

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setResults([]);

    const res = await searchRooms(form.branch, form.roomType, form.checkIn, form.checkOut);

    if (res.error) {
      setMessage(res.error);
    } else if (res.length === 0) {
      setMessage("❌ No rooms available for the selected criteria.");
    } else {
      setMessage("✅ Rooms found!");
      setResults(res);
    }

    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Book with Us</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <select name="branch" value={form.branch} onChange={handleChange} style={styles.input}>
  <option value="">-- Select Branch --</option>
  <option value="SkyNest Urban">SkyNest Urban</option>
  <option value="SkyNest HillCountry">SkyNest HillCountry</option>
  <option value="SkyNest DownSouth">SkyNest DownSouth</option>
</select>

<select name="roomType" value={form.roomType} onChange={handleChange} style={styles.input}>
  <option value="">-- Select Room Type --</option>
  <option value="Single">Single</option>
  <option value="Double">Double</option>
  <option value="Deluxe">Deluxe</option>
  <option value="Suite">Suite</option>
</select>


          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button 
            type="submit" 
            style={{...styles.button, ...(isLoading ? styles.buttonLoading : {})}}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
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

        {/* Display results if available */}
        {results.length > 0 && (
          <div style={styles.results}>
            {results.map((room, idx) => (
              <div key={idx} style={styles.resultCard}>
                <h4>{room.type_name}</h4>
                <h4>{room.room_number}</h4>
                <p>{room.description}</p>
                <p><strong>Rate:</strong> ${room.base_rate}</p>
                <p><strong>Amenities:</strong> {room.amentities}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh", padding: "1rem" },
  card: { backgroundColor: "#fff", padding: "2rem", borderRadius: "15px", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", width: "100%", maxWidth: "500px", textAlign: "center" },
  heading: { marginBottom: "1.5rem", color: "#003366", fontSize: "1.8rem" },
  form: { display: "flex", flexDirection: "column" },
  input: { padding: "0.8rem", marginBottom: "1rem", borderRadius: "5px", border: "1px solid #ccc", fontSize: "1rem", outline: "none" },
  button: { padding: "0.8rem", backgroundColor: "#003366", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s ease", marginBottom: "1rem", fontSize: "1rem" },
  buttonLoading: { opacity: 0.7, cursor: "not-allowed" },
  message: { marginTop: "1rem", fontWeight: "500", padding: "0.5rem", borderRadius: "5px" },
  successMessage: { color: "#2ecc71", backgroundColor: "rgba(46, 204, 113, 0.1)" },
  errorMessage: { color: "#e74c3c", backgroundColor: "rgba(231, 76, 60, 0.1)" },
  results: { marginTop: "1.5rem", textAlign: "left" },
  resultCard: { border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", background: "#f9f9f9" }
};
