import React, { createContext, useContext, useState, useEffect } from 'react';
import customFetch from "../api"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        verifyAuth();
    }, []);
   const verifyAuth = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
// console.log("Token:", token);
    if (!token || !email) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
    }

    try {
        const { status, body } = await customFetch("auth/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ email ,token })
        });

        if (status === 200 && body.valid) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    } catch (err) {
        console.error("Verification failed:", err);
        setIsAuthenticated(false);
    } finally {
        setLoading(false);
    }
};



    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,verifyAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
