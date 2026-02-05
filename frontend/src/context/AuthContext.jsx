import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Always initialize as Guest User
  const [user, setUser] = useState({
    _id: 'guest_user_123',
    name: 'Guest User',
    email: 'guest@example.com',
    role: 'user',
    avatar: ''
  });

  // Always authenticated
  const [token, setToken] = useState('guest_token_bypass');
  const [loading, setLoading] = useState(false); // No loading needed

  // Disable actual API fetching for Guest Mode
  /*
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);
  
  const fetchUser = async () => { ... }
  */

  // Mock Login (does nothing, already logged in)
  const login = async (email, password) => {
    return { success: true, message: 'Always logged in as Guest' };
  };

  // Mock Register (does nothing, already logged in)
  const register = async (name, email, password, phone) => {
    return { success: true, message: 'Registration bypassed (Guest Mode)' };
  };

  const logout = () => {
    // Optional: Could "reset" to guest, but we are permanent guest now.
    // simpler to just do nothing or toast "You are in Guest Mode"
    console.log('Logout ignored in Guest Mode');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: true, // ALWAYS TRUE
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
