import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type UserInfo = {
  fname: string;
  mname: string;
  lname: string;
  username: string;
  email: string;
  contact: string;
  address: string;
  profilePicture: string;
  oldpassword: string;
  password: string;
  confirmPassword: string;
};

const UserContext = createContext<{
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  handleSignOut: () => Promise<void>; // Add the logout method type
} | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    fname: '',
    mname: '',
    lname: '',
    username: '',
    email: '',
    contact: '',
    address: '',
    oldpassword: '',
    password: '',
    confirmPassword: '',
    profilePicture: 'http://192.168.1.200/images/users/default.png',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        try {
          const response = await fetch(`http://192.168.1.200/api/profile/get?userid=${userId}`);
          const json = await response.json();
          if (json.success) {
            const { data } = json;
            setUserInfo({
              fname: data.fname || '',
              mname: data.mname || '',
              lname: data.lname || '',
              username: data.username,
              email: data.email,
              contact: data.contact || '',
              address: data.address || '',
              profilePicture: data.profile_img
                ? `http://192.168.1.200/images/users/${data.profile_img}`
                : 'http://192.168.1.200/images/users/default.png',
              oldpassword: '',
              password: '',
              confirmPassword: '',
            });
          } else {
            console.error("Failed to fetch user profile:", json.message);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } else {
        console.error("User ID not found in AsyncStorage.");
      }
    };

    fetchUserProfile();
  }, []); // Run once on mount

  const handleSignOut = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('user_id'); // Remove user ID from storage
      setUserInfo({ // Reset user info to default state
        fname: '',
        mname: '',
        lname: '',
        username: '',
        email: '',
        contact: '',
        address: '',
        oldpassword: '',
        password: '',
        confirmPassword: '',
        profilePicture: 'http://192.168.1.200/images/users/default.png',
      });
      // Optional: Notify user about successful logout (you may want to use your notification method)
      console.log("Successfully logged out");
      router.push("/"); // Uncomment and implement routing if needed
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, handleSignOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
