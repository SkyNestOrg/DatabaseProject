import React, { createContext, useState, useEffect } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

// this is used to share data globally within component tree
export const AuthContext = createContext();

const readToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (error) {
    console.error("Error reading token from localStorage:", error);
    return null;
  }
};

const readUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(readToken());
  const [user, setUser] = useState(readUser());

  const isAuthenticated = !!token;

  useEffect(() => {
    const onStorage = () => {
      setToken(readToken());
      setUser(readUser());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (newToken, newUser = null) => {
    try {
      localStorage.setItem("token", newToken);
      if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      throw new Error("Failed to save authentication data");
    }
  };

  const logout = (redirect = true) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      if (redirect) window.location.href = "/login";
    } catch (error) {
      console.error("Error during logout:", error);
      // Force logout even if localStorage fails
      setToken(null);
      setUser(null);
      if (redirect) window.location.href = "/login";
    }
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider
        value={{ token, user, isAuthenticated, login, logout }}
      >
        {children}
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};
