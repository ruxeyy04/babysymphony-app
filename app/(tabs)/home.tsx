import React, { useState, useEffect } from "react";
import { View, ScrollView, Image, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, List, Avatar } from "react-native-paper";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useTheme } from "@/hooks/useAppTheme";
import dayjs from "dayjs";
import { useUserContext } from "@/context/UserContext";

const themes = {
  light: {
    background: "#EFF8FF",
    appbar: "#D2EBFF",
    textColor: "#2D2D2D",
    iconColor: "#ffffff"
  },
  dark: {
    background: "#1B1B1F",
    appbar: "#282831",
    textColor: "#D7E0F9",
    iconColor: "#5f5575"
  },
};
const Home = () => {
  const { userInfo } = useUserContext();
  const { theme, setTheme } = useTheme();
  const deviceColorScheme = useColorScheme();
  const currentTheme =
    theme === "system_default"
      ? deviceColorScheme === "dark"
        ? themes.dark
        : themes.light
      : theme === "dark_mode"
        ? themes.dark
        : themes.light;
        
  const { authData } = useGoogleAuth();

  const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm:ss"));
  const [recentAlert, setRecentAlert] = useState("No alerts at this time");
  const [children, setChildren] = useState([
    { name: "John Doe", age: 5 },
    { name: "Jane Doe", age: 3 },
  ]);
  const [devices, setDevices] = useState([
    { id: 1, name: "Smart Thermometer" },
    { id: 2, name: "Baby Monitor" },
  ]);

  const [currentDateTime, setCurrentDateTime] = useState({
    time: dayjs().format("hh:mm:ss A"), // 12-hour format
    date: dayjs().format("MMMM D, YYYY"), // "January 1, 1970" format
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime({
        time: dayjs().format("hh:mm:ss A"),
        date: dayjs().format("MMMM D, YYYY"),
      });
    }, 1000); // Updates every second
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: currentTheme.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* Welcome Section */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" style={{ color: currentTheme.textColor }}>
              Welcome
            </Text>
            <Text
              variant="titleLarge"
              style={{ fontWeight: "bold", color: currentTheme.textColor }}
            >
              {userInfo.fname || userInfo.username} {userInfo.lname ? userInfo.lname : ''}
            </Text>
          </View>
          <Avatar.Image
            size={48}
            source={
                 { uri: userInfo.profilePicture }
            }
          />
        </View>

        {/* Date and Time Section */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text
              variant="titleLarge"
              style={{ color: currentTheme.textColor }}
            >
              Date: {currentDateTime.date}
            </Text>
            <Text
              variant="titleLarge"
              style={{ color: currentTheme.textColor }}
            >
              Time: {currentDateTime.time}
            </Text>
          </Card.Content>
        </Card>

        {/* Recent Alert */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Title
            title="Recent Alert"
            left={(props) => (
              <Avatar.Icon {...props} icon="bell-alert" size={40} />
            )}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: currentTheme.textColor }}>
              {recentAlert}
            </Text>
          </Card.Content>
        </Card>

        {/* List of Children */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Title
            title="Children"
            left={(props) => <Avatar.Icon {...props} icon="account-child" size={40} />}
          />
          <Card.Content>
            {children.map((child, index) => (
              <List.Item
                key={index}
                title={child.name}
                description={`Age: ${child.age}`}
                left={(props) => <Avatar.Icon {...props} icon="account" color={currentTheme.iconColor} />}
              />
            ))}
          </Card.Content>
        </Card>

        {/* List of Devices */}
        <Card>
          <Card.Title
            title="Devices"
            left={(props) => <Avatar.Icon {...props} icon="devices" size={40} />}
          />
          <Card.Content>
            {devices.map((device, index) => (
              <List.Item
                key={index}
                title={device.name}
                left={(props) => <Avatar.Icon {...props} icon="tablet" color={currentTheme.iconColor} />}
              />
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
