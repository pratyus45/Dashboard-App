import { createContext, useState, useEffect } from "react";
import * as api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if we have a user in localStorage
useEffect(() => {
    try {
      const userId = localStorage.getItem('currentUserId');
      if (userId) {
        const users = api.getUsers();
        // Add a check to make sure users and the specific user exist
        if (users && users[userId]) {
          setCurrentUser(users[userId]);
        } else {
          // If the user ID is bad (stale), remove it
          localStorage.removeItem('currentUserId');
        }
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
    }
    setLoading(false); // Make sure this always runs
  }, []);

  const login = (userId) => {
    const users = api.getUsers();
    const user = users[userId];
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

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};