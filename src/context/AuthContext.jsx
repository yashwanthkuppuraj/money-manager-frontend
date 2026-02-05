import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for user/token on load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    // Register User
    const register = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', userData);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    // Login User
    const login = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', userData);
            if (response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                setUser(response.data);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    // Logout User
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // Update User Settings
    const updateUserSettings = async (newSettings) => {
        if (!user || !user.token) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const response = await axios.put('http://localhost:5000/api/settings', newSettings, config);

            // Update local state
            const updatedUser = { ...user, settings: response.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist

            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to update settings';
        }
    };

    const value = {
        user,
        isLoading,
        register,
        login,
        logout,
        updateUserSettings
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
