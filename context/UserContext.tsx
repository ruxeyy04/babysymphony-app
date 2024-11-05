import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Pusher, PusherChannel, PusherEvent } from '@pusher/pusher-websocket-react-native';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import axios from 'axios';

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
interface Device {
  device_id: string;
  name: string;
  brand: string;
  model: string;
  created_at: string;
}

interface Baby {
  id: string;
  fname: string;
  mname: string;
  lname: string;
  name: string;
  age: number;
  info: string;
  gender: string;
  deviceId: string;
}

type Notification = {
  id: number;
  title: string;
  description: string;
  acknowledge: number;
  created_at: string;
};

const UserContext = createContext<{
  userInfo: UserInfo;
  notifications: Notification[];
  booleanNotif: boolean;
  devices: Device[];
  baby: Baby[];
  fetchDevice: (userId: string) => Promise<void>;
  fetchBaby: (userId: string) => Promise<void>;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  setBooleanNotif: React.Dispatch<React.SetStateAction<boolean>>; // Add this line
  handleSignOut: () => Promise<void>;
  setupPusher: () => void;
  fetchUserProfile: () => void;
  acknowledgeNotification: (id: number) => Promise<void>;
  deleteNotif: (id: number) => Promise<void>;
} | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [baby, setBaby] = useState<Baby[]>([]);
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [booleanNotif, setBooleanNotif] = useState<boolean>(false);
  const pusher = Pusher.getInstance();

  useEffect(() => {
    const initializeApp = async () => {
      await Notifications.getPermissionsAsync();
      await fetchUserProfile();
      await loadNotifications();
      await setupPusher();
    };

    initializeApp();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const datePart = new Intl.DateTimeFormat('en-US', options).format(date);

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const timePart = new Intl.DateTimeFormat('en-US', timeOptions).format(date);

    return `${datePart}, ${timePart}`;
  };

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
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
      fetchDevice(userId);
      fetchBaby(userId);
    }
  };

  const loadNotifications = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (userId) {
      try {
        const response = await fetch(`http://192.168.1.200/api/notif/get?userid=${userId}`);
        const json = await response.json();
        if (json.success) {
          setNotifications(json.data);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    }
  };
  const fetchDevice = async (userId: string) => {
    try {
      const response = await axios.get(`http://192.168.1.200/api/device/get?userid=${userId}`);
      if (response.data.success) {
        const devices = response.data.data.map((device: any) => ({
          device_id: device.id,
          name: device.name,
          brand: device.brand,
          model: device.model,
          created_at: device.created_at,
        }));
        setDevices(devices);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const fetchBaby = async (userId: string) => {
    try {
      const response = await axios.get(`http://192.168.1.200/api/baby/get?userid=${userId}`);
      if (response.data.success) {
        const formattedBaby = response.data.data.map((Baby: any) => ({
          id: Baby.id,
          fname: Baby.fname,
          mname: Baby.mname,
          lname: Baby.lname,
          name: `${Baby.fname} ${Baby.lname}`,
          age: Baby.months,
          info: Baby.gender,
          gender: Baby.gender,
          deviceId: Baby.device_id,
        }));
        setBaby(formattedBaby);
      }
    } catch (error) {
      console.error('Error fetching baby:', error);
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
          onEvent: async (event: PusherEvent) => {
            if (event.eventName === "notification") {
              console.log(`Event received: ${event.eventName}`);
              const parsedData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
              console.log(parsedData.title, parsedData.description);
              Alert.alert(parsedData.title, parsedData.description)
              setBooleanNotif(true);
              const newNotification = {
                id: Math.random(),
                title: parsedData.title,
                description: parsedData.description,
                acknowledge: 0,
                created_at: formatDate(new Date().toISOString()),
              };
              setNotifications((prev) => [newNotification, ...prev]);




              sendNotification(newNotification.title, newNotification.description);
            }
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

  const acknowledgeNotification = async (id: number) => {
    try {
      await axios.post(`http://192.168.1.200/api/notif/acknowledge`, {
        id: id
      });
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, acknowledge: 1 } : notif))
      );
      setBooleanNotif(false); // Set booleanNotif back to false once a notification is acknowledged
    } catch (error) {
      console.error('Failed to acknowledge notification:', error);
    }
  };
  const deleteNotif = async (id: number) => {
    try {
      // Send delete request to backend
      const response = await axios.post(`http://192.168.1.200/api/notif/delete`, {
        id: id,
      });

      // Check if the deletion was successful
      if (response.data.success) {
        // Remove the notification from local state
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      } else {
        console.error('Failed to delete notification on server:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
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
      router.push('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        notifications,
        booleanNotif,
        setUserInfo,
        setBooleanNotif, // Add this line
        handleSignOut,
        setupPusher,
        fetchUserProfile,
        acknowledgeNotification,
        deleteNotif,
        devices, baby, fetchDevice, fetchBaby
      }}
    >
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
