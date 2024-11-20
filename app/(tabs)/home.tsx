import React, { useState, useEffect } from "react";
import { View, ScrollView, Image, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Card, List, Avatar, Button } from "react-native-paper";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useTheme } from "@/hooks/useAppTheme";
import dayjs from "dayjs";
import { useUserContext } from "@/context/UserContext";
import { useTabNavigation } from "@/context/TabNavigationContext";

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
  const { setIndex } = useTabNavigation();  // Use the context here

  const { userInfo, notifications, listBabies, listDevices } = useUserContext();
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
    { name: "John Doe", age: '5 Months' },
    { name: "Juan Cruz", age: '3 Months' },
  ]);
  const [devices, setDevices] = useState([
    { id: 1, name: "Device ID: LBSYMP36581652" },
    { id: 2, name: "Device ID: LBSYMP36581651" },
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
  const recentNotifications = notifications.slice(0, 3);
  const recentChildren = listBabies.slice(0, 3);
  const recentDevices = listDevices.slice(0, 3);
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
            title="Recent Notification"
            left={(props) => <Avatar.Icon {...props} icon="bell-alert" size={40} />}
          />
          <Card.Content>
            {recentNotifications.length > 0 ? (
              recentNotifications.slice(0, 3).map((notif, index) => (
                <List.Item
                  key={index}
                  title={notif.title}
                  description={notif.description}
                  left={(props) => (
                    <Avatar.Icon {...props} icon="alert-circle" size={24} color={currentTheme.iconColor} />
                  )}
                  style={{
                    paddingVertical: 8,
                    borderBottomWidth: index < recentNotifications.length - 1 ? 1 : 0,
                    borderBottomColor: currentTheme.iconColor // Divider color
                  }}
                  titleStyle={{ fontWeight: 'bold' }}
                  descriptionStyle={{ color: currentTheme.textColor }}
                />
              ))
            ) : (
              <Text style={{ color: currentTheme.textColor, textAlign: 'center', padding: 16 }}>
                No Recent Notifications
              </Text>
            )}
          </Card.Content>
        </Card>




        {/* List of Children */}
        <Card style={{ marginBottom: 16, borderRadius: 8, elevation: 2 }}>
          <Card.Title
            title="Baby"
            left={(props) => <Avatar.Icon {...props} icon="account-child" size={40} />}
          />
          <Card.Content>
            {recentChildren.length > 0 ? (
              recentChildren.slice(0, 3).map((child, index) => (
                <List.Item
                  key={index}
                  title={child.nickname}
                  description={`Age: ${child.age} Months`}
                  left={(props) => (
                    <Avatar.Icon {...props} icon="baby-face" size={30} color={currentTheme.iconColor} />
                  )}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: index < recentChildren.length - 1 ? 1 : 0,
                    borderBottomColor: currentTheme.iconColor, // Divider color
                  }}
                  titleStyle={{ fontWeight: 'bold', color: currentTheme.textColor }}
                  descriptionStyle={{ color: currentTheme.textColor }}
                />
              ))
            ) : (
              <Text style={{ color: currentTheme.textColor, textAlign: 'center', padding: 16 }}>
                No Recent Baby
              </Text>
            )}
          </Card.Content>
          {listBabies.length > 3 && (
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
              <Button onPress={() => setIndex(1)} mode="text" labelStyle={{ color: currentTheme.textColor }}>
                View More
              </Button>
            </Card.Actions>
          )}
        </Card>


        {/* List of Devices */}
        <Card style={{ marginBottom: 16, borderRadius: 8, elevation: 2 }}>
          <Card.Title
            title="Devices"
            left={(props) => <Avatar.Icon {...props} icon="devices" size={40} />}
          />
          <Card.Content>
            {recentDevices.length > 0 ? (
              recentDevices.slice(0, 3).map((device, index) => (
                <List.Item
                  key={index}
                  title={device.name}
                  left={(props) => (
                    <Avatar.Icon {...props} icon="tablet" size={30} color={currentTheme.iconColor} />
                  )}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: index < recentDevices.length - 1 ? 1 : 0,
                    borderBottomColor: currentTheme.iconColor, // Divider color
                  }}
                  titleStyle={{ fontWeight: 'bold', color: currentTheme.textColor }}
                />
              ))
            ) : (
              <Text style={{ color: currentTheme.textColor, textAlign: 'center', padding: 16 }}>
                No Recent Devices
              </Text>
            )}
          </Card.Content>
          {listDevices.length > 3 && (
            <Card.Actions style={{ justifyContent: 'flex-end' }}>
              <Button onPress={() => setIndex(2)} mode="text" labelStyle={{ color: currentTheme.textColor }}>
                View More
              </Button>
            </Card.Actions>
          )}
        </Card>


      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
