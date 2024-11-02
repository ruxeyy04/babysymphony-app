import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Pusher, PusherChannel, PusherEvent } from '@pusher/pusher-websocket-react-native';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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
  handleSignOut: () => Promise<void>;
  setupPusher: () => void;
  fetchUserProfile: () => void;
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
  const pusher = Pusher.getInstance();

  useEffect(() => {
    const initializeApp = async () => {
      // Request Notification Permissions
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }

      await fetchUserProfile();
      await setupPusher();
    };

    initializeApp();
  }, []);

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
          console.error('Failed to fetch user profile:', json.message);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    }
  };

  const setupPusher = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (userId) {
      try {
        await pusher.init({
          apiKey: '9cd89ff693706c8e73e0',
          cluster: 'ap1',
          authEndpoint: 'http://192.168.1.200/api/pusher/auth',
        });
        await pusher.connect();

        await pusher.subscribe({
          channelName: `private-user-channel.${userId}`,
          onEvent: (event: PusherEvent) => {
            console.log(`Event received: ${event.eventName}`);
            Alert.alert(event.eventName, event.data);
            sendNotification(event.eventName, event.data);
          },
        });
      } catch (error) {
        console.error('Failed to setup Pusher:', error);
      }
    }
  };

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null,
    });
  };

  const handleSignOut = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      setUserInfo({
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
      await pusher.unsubscribe({ channelName: `private-user-channel.${userId}` });
      await pusher.disconnect();
      await AsyncStorage.removeItem('user_id');
      console.log('Successfully logged out');
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, handleSignOut, setupPusher, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
