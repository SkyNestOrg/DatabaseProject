import React from 'react';

function Dashboard() {
  const styles = {
    dashboard: {
      display: 'grid',
      gridTemplateAreas: `
        "header header"
        "sidebar content"
      `,
      gridTemplateColumns: '200px 1fr',
      gridTemplateRows: '60px 1fr',
      height: '100vh',
      fontFamily: 'sans-serif',
    },
    header: {
      gridArea: 'header',
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem',
    },
    sidebar: {
      gridArea: 'sidebar',
      backgroundColor: '#34495e',
      color: 'white',
      padding: '1rem',
    },
    sidebarList: {
      listStyle: 'none',
      padding: 0,
    },
    sidebarItem: {
      margin: '1rem 0',
      cursor: 'pointer',
    },
    content: {
      gridArea: 'content',
      padding: '2rem',
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
    },
    card: {
      background: '#ecf0f1',
      padding: '1rem',
      borderRadius: '8px',
      width: '200px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <h1>Admin Dashboard</h1>
      </header>

      <nav style={styles.sidebar}>
        <ul style={styles.sidebarList}>
          <li style={styles.sidebarItem}>Overview</li>
          <li style={styles.sidebarItem}>Users</li>
          <li style={styles.sidebarItem}>Settings</li>
        </ul>
      </nav>

      <main style={styles.content}>
        <section style={styles.card}>
          <h2>Total Users</h2>
          <p>1,234</p>
        </section>
        <section style={styles.card}>
          <h2>Active Sessions</h2>
          <p>87</p>
        </section>
        <section style={styles.card}>
          <h2>System Health</h2>
          <p>✅ All systems operational</p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;