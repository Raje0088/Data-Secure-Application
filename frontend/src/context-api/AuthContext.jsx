import React from "react";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userLoginId, setUserLoginId] = useState(()=>{
    return localStorage.getItem("userLoginId") || null
  });

  useEffect(() => {
    localStorage.getItem("userLoginId");
  }, [userLoginId]);
  useEffect(() => {
    if (userLoginId) {
      localStorage.setItem("userLoginId", userLoginId);
    }
  }, [userLoginId]);

  return (
    <AuthContext.Provider value={{ userLoginId, setUserLoginId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
