import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import GuestRegister from "./pages/GuestRegister";
import GuestLogin from "./pages/GuestLogin";
import RoomSearch from "./pages/RoomSearch";
import MyAccount from "./pages/MyAccount";

function Home() {
  const branches = [
    {
      id: 1,
      name: "SkyNest Urban",
      address: "7 SkyNest Bvid Colombo 01",
      city: "Colombo",
      contact: "0112100100",
      image: "🏙️"
    },
    {
      id: 2,
      name: "SkyNest DownSouth",
      address: "114 Galle",
      city: "Galle",
      contact: "0917100100",
      image: "🏖️"
    },
    {
      id: 3,
      name: "SkyNest Hillcountry",
      address: "456 Colombo Road Kandy",
      city: "Kandy",
      contact: "0815100100",
      image: "⛰️"
    }
  ];

  return (
    <div>
      <div style={styles.heroContainer}>
        <h1 style={styles.title}>Welcome to 🏨 Skynest</h1>
        <p style={styles.subtitle}>Your luxury stay experience begins here.</p>
        <div style={styles.buttonContainer}>
          <Link to="/guest-login" style={styles.ctaButton}>
            Guest Login
          </Link>
          <Link to="/guest-register" style={styles.ctaButtonSecondary}>
            Register as Guest
          </Link>
        </div>
      </div>
      
      <div style={styles.branchesSection}>
        <h2 style={styles.sectionTitle}>Our Branches</h2>
        <p style={styles.sectionSubtitle}>Experience luxury at any of our premium locations</p>
        
        <div style={styles.branchesContainer}>
          {branches.map(branch => (
            <div key={branch.id} style={styles.branchCard}>
              <div style={styles.branchImage}>
                {branch.image}
              </div>
              <h3 style={styles.branchName}>{branch.name}</h3>
              <p style={styles.branchAddress}>{branch.address}</p>
              <p style={styles.branchCity}>{branch.city}</p>
              <p style={styles.branchContact}>📞 {branch.contact}</p>
              <button style={styles.branchButton}>Explore</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <h1 style={styles.logo}>🏨 Skynest</h1>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
          <Link to="/guest-login" style={styles.navLink}>
            Guest Login
          </Link>
          <Link to="/guest-register" style={styles.navLink}>
            Guest Registration
          </Link>
          <Link to="/room-search" style={styles.navLink}>
            Room Search
          </Link>
        </nav>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guest-login" element={<GuestLogin />} />
          <Route path="/guest-register" element={<GuestRegister />} />
          <Route path="/room-search" element={<RoomSearch />} />
          <Route
            path="*"
            element={
              <div style={styles.notFound}>
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <Link to="/" style={styles.ctaButton}>
                  Return Home
                </Link>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

// ------------------- Updated Styles -------------------
const styles = {
  // Layout Styles
  layout: {
    minHeight: "100vh",
    backgroundColor: "#f5f8fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    backgroundColor: "#2c3e50",
    color: "white",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  logo: {
    margin: 0,
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#ecf0f1",
  },
  nav: {
    display: "flex",
    gap: "1.5rem",
  },
  navLink: {
    color: "#ecf0f1",
    textDecoration: "none",
    fontWeight: "500",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
  },
  main: {
    padding: "2rem",
    minHeight: "calc(100vh - 80px)",
  },

  // Hero Section Styles
  heroContainer: {
    textAlign: "center",
    padding: "4rem 2rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "15px",
    color: "white",
    margin: "2rem auto",
    maxWidth: "800px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    animation: "fadeIn 1s ease forwards",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
    opacity: 0.9,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  ctaButton: {
    display: "inline-block",
    padding: "1rem 2rem",
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  ctaButtonSecondary: {
    display: "inline-block",
    padding: "1rem 2rem",
    backgroundColor: "#e74c3c",
    color: "white",
    textDecoration: "none",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },

  // Branches Section Styles
  branchesSection: {
    padding: "4rem 2rem",
    textAlign: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "2.5rem",
    color: "#2c3e50",
    marginBottom: "1rem",
  },
  sectionSubtitle: {
    fontSize: "1.1rem",
    color: "#7f8c8d",
    marginBottom: "3rem",
  },
  branchesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  },
  branchCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "2rem",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  branchImage: {
    fontSize: "4rem",
    marginBottom: "1.5rem",
  },
  branchName: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#2c3e50",
    margin: "0 0 1rem 0",
  },
  branchAddress: {
    color: "#7f8c8d",
    margin: "0 0 0.5rem 0",
  },
  branchCity: {
    color: "#7f8c8d",
    margin: "0 0 1rem 0",
    fontWeight: "bold",
  },
  branchContact: {
    color: "#3498db",
    margin: "0 0 1.5rem 0",
    fontWeight: "500",
  },
  branchButton: {
    padding: "0.8rem 1.5rem",
    backgroundColor: "#2c3e50",
    color: "white",
    border: "none",
    borderRadius: "50px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // 404 Page Styles
  notFound: {
    textAlign: "center",
    padding: "4rem 2rem",
    color: "#7f8c8d",
  },
};

// Add global styles using a style tag
const globalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: #f5f8fa;
  }
  
  a {
    transition: all 0.3s ease;
  }
  
  a:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
  
  .nav-link:hover {
    background-color: #34495e !important;
  }
  
  .branch-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.15);
  }
  
  .branch-button:hover {
    background-color: #3498db !important;
    transform: translateY(-2px);
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}