import React, { createContext, useState, useEffect } from "react";

// this is used to share data globally within component tree
export const AuthContext = createContext();

const readToken = () => localStorage.getItem("token") || null;
const readUser = () => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
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
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const login = (newToken, newUser = null) => {
        localStorage.setItem('token', newToken);
        if (newUser) localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = (redirect = true) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        if (redirect) window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};