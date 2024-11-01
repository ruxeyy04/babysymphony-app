// AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthData, AuthContextType } from "@/types/AuthTypes"; // Adjust path as necessary

const defaultContextValue: AuthContextType = {
  authData: null,
  saveAuthData: async () => { },
  clearAuthData: async () => { },
};
interface AuthProviderProps {
  children: ReactNode;
}
export const GoogleAuthContext =
  createContext<AuthContextType>(defaultContextValue);

export const GoogleAuthProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  const loadAuthData = async () => {
    try {
      const data = await AsyncStorage.getItem("authData");
      if (data) {
        setAuthData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load authentication data", error);
    }
  };

  const saveAuthData = async (data: AuthData) => {
    try {
      await AsyncStorage.setItem("authData", JSON.stringify(data));
      setAuthData(data);
    } catch (error) {
      console.error("Failed to save authentication data", error);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem("authData");
      setAuthData(null);
    } catch (error) {
      console.error("Failed to clear authentication data", error);
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  return (
    <GoogleAuthContext.Provider
      value={{ authData, saveAuthData, clearAuthData }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};
