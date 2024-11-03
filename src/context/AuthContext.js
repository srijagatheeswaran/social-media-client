
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async (email, token) => {
        try {
            const response = await fetch('http://localhost:3000/apiVerify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token }),
            });
            const data = await response.json();
            setIsAuthenticated(data.isValid);
            return data.isValid;
        } catch (error) {
            console.error('Error verifying email and token:', error);
            setIsAuthenticated(false);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
