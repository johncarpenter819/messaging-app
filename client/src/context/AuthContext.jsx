import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const cleanStorageItem = (key) => {
  const item = localStorage.getItem(key);
  if (item === "null" || item === "undefined" || item === "") {
    return null;
  }
  return item;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: cleanStorageItem("token"),
    userId: cleanStorageItem("userId"),
    username: cleanStorageItem("username"),
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token || "");
    localStorage.setItem("userId", userData.userId || "");
    localStorage.setItem("username", userData.username || "");
  };

  const logout = () => {
    setUser({ token: null, userId: null, username: null });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  };

  const value = {
    ...user,
    isLoggedIn: !!user.token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
