// client/src/api/guestApi.js
const API_BASE_URL = 'http://localhost:5000/api';

export const registerGuest = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/guest/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    return { error: error.message || 'Could not connect to the server' };
  }
};


// client/src/api/guestApi.js
export const loginGuest = async (username, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/guest/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(`Server error: ${text.substring(0, 100)}...`);
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    return { error: error.message || 'Could not connect to the server' };
  }
};


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
};

export const getGuestDetails = async (guestId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/guest/${guestId}`, {
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const updateGuestDetails = async (guestId, details) => {
  try {
    const res = await fetch(`${API_BASE_URL}/guest/${guestId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(details),
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const bookRoom = async (guestId, booking) => {
  try {
    const res = await fetch(`${API_BASE_URL}/guest/${guestId}/book`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(booking),
    });
    return await res.json();
  } catch (error) {
    return { error: error.message };
  }
};
