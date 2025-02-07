import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { setupAutoLogout } from '../utils/autoLogout';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Setup auto-logout when user is logged in
  useEffect(() => {
    if (user) {
      const cleanup = setupAutoLogout(() => {
        logout();
        // Optionally show a notification to the user
        alert('Your session has been automatically logged out at 3:30 AM IST.');
      });
      
      // Cleanup when component unmounts or user logs out
      return cleanup;
    }
  }, [user]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('http://localhost:8000/auth/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post('http://localhost:8000/auth/token', formData);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    await fetchUserProfile(access_token);
  };

  const register = async (email, username, password) => {
    const response = await axios.post('http://localhost:8000/auth/register', {
      email,
      username,
      password
    });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
