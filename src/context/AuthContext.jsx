import { createContext, useState, useEffect, useContext } from "react";
import * as api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        const users = api.getUsers();
        if (users && users[userId]) {
          setCurrentUser(users[userId]);
        } else {
          localStorage.removeItem('currentUserId');
        }
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
    }
    setLoading(false);
  }, []);

  const login = (userId) => {
    const users = api.getUsers();
    const user = users ? users[userId] : null;
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUserId', user.id);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };

  const value = { currentUser, login, logout, loading };

  // Render children only when not loading
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Also add this to the file to fix the warning you saw
export const useAuthContext = () => {
  return useContext(AuthContext);
};