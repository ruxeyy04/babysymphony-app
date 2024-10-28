import React, { useLayoutEffect, useState } from "react";
import { View, StyleSheet, ScrollView, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  List,
  Divider,
  RadioButton,
  Appbar,
  TextInput,
  Button,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/hooks/useAppTheme";

const themes = {
  light: {
    background: "#EFF8FF",
    appbar: "#D2EBFF",
    textColor: "#2D2D2D",
  },
  dark: {
    background: "#1B1B1F",
    appbar: "#282831",
    textColor: "#D7E0F9",
  },
};

export default function Settings() {
  const navigation = useNavigation();
  const { theme, setTheme } = useTheme();
  const deviceColorScheme = useColorScheme();
  const paperTheme = usePaperTheme();

  const [userInfo, setUserInfo] = useState({
    fname: "",
    mname: "",
    lname: "",
    username: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("app_theme");
        if (savedTheme) setTheme(savedTheme);
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage:", error);
      }
    };
    loadTheme();
  }, [setTheme]);

  const handleThemeChange = async (value: string) => {
    try {
      await AsyncStorage.setItem("app_theme", value);
      setTheme(value);
    } catch (error) {
      console.error("Failed to save theme to AsyncStorage:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setUserInfo({ ...userInfo, [field]: value });
  };

  const handleUpdate = () => {
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Handle update logic here (e.g., API call)
    alert("Information updated successfully");
  };

  const currentTheme =
    theme === "system_default"
      ? deviceColorScheme === "dark"
        ? themes.dark
        : themes.light
      : theme === "dark_mode"
      ? themes.dark
      : themes.light;

  return (
    <GestureHandlerRootView style={styles.flexContainer}>
      <Appbar.Header mode="small" elevated style={[styles.appbar, { backgroundColor: currentTheme.appbar }]}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={currentTheme.textColor} />
        <Appbar.Content title="Settings" titleStyle={{ color: currentTheme.textColor }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: currentTheme.background }]}>
        {/* Theme Section */}
        <List.Section title="Application Theme" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
          <RadioButton.Group value={theme} onValueChange={handleThemeChange}>
            <RadioButton.Item label="System Default" value="system_default" labelStyle={{ color: currentTheme.textColor }} />
            <RadioButton.Item label="Dark Mode" value="dark_mode" labelStyle={{ color: currentTheme.textColor }} />
            <RadioButton.Item label="Light Mode" value="light_mode" labelStyle={{ color: currentTheme.textColor }} />
          </RadioButton.Group>
          <Divider />
        </List.Section>

        {/* Personal Information Section */}
        <List.Section title="Personal Information" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
          <TextInput
            label="First Name" className="text-white"
            value={userInfo.fname}
            onChangeText={(value) => handleChange("fname", value)}
            style={styles.input}
          />
          <TextInput
            label="Middle Name"
            value={userInfo.mname}
            onChangeText={(value) => handleChange("mname", value)}
            style={styles.input}
          />
          <TextInput
            label="Last Name"
            value={userInfo.lname}
            onChangeText={(value) => handleChange("lname", value)}
            style={styles.input}
          />
          <TextInput
            label="Username"
            value={userInfo.username}
            onChangeText={(value) => handleChange("username", value)}
            style={styles.input}
          />
        </List.Section>

        {/* Contact Information Section */}
        <List.Section title="Contact Information" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
          <TextInput
            label="Email"
            value={userInfo.email}
            onChangeText={(value) => handleChange("email", value)}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="Contact Number"
            value={userInfo.contact}
            onChangeText={(value) => handleChange("contact", value)}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            label="Address"
            value={userInfo.address}
            onChangeText={(value) => handleChange("address", value)}
            style={styles.input}
          />
        </List.Section>

        {/* Security Section */}
        <List.Section title="Security" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
          <TextInput
            label="Password"
            value={userInfo.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Confirm Password"
            value={userInfo.confirmPassword}
            onChangeText={(value) => handleChange("confirmPassword", value)}
            secureTextEntry
            style={styles.input}
          />
        </List.Section>

        {/* Update Button */}
        <Button
          mode="contained"
          onPress={handleUpdate}
          style={styles.updateButton}
        >
          Update Information
        </Button>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  appbar: {
    elevation: 4,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 10,
    color: "white"
  },
  input: {
    margin: 8,
  },
  updateButton: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
});
