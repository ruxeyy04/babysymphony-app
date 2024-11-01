import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Image, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  List,
  Divider,
  RadioButton,
  Appbar,
  TextInput,
  Button,
  useTheme as usePaperTheme,
  Text,
  PaperProvider,
  MD3DarkTheme, MD3LightTheme
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/hooks/useAppTheme";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import axios from "axios";
import { useUserContext } from "@/context/UserContext";

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
interface UserInfo {
  fname: string;
  mname: string;
  lname: string;
  username: string;
  email: string;
  contact: string;
  address: string;
  oldpassword: string;
  password: string;
  confirmPassword: string;
}
const Settings = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const paperTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme

  const { theme, setTheme } = useTheme();
  const deviceColorScheme = useColorScheme();
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState("http://192.168.1.200/images/users/default.png");
  const [userId, setUserId] = useState<string | null>(null);

  const { userInfo, setUserInfo } = useUserContext();
  const [errors, setErrors] = useState({
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
  });
  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUserId = await AsyncStorage.getItem('user_id'); // Get user_id from AsyncStorage
      setUserId(storedUserId); // Set userId state if found

    };

    checkLoginStatus();
  }, []);

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
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const formData = new FormData();
      formData.append('profile_image', {
        uri: uri,
        name: `profile_image_${Date.now()}.jpg`,
        type: 'image/jpeg',
      } as any);
      formData.append('user_id', userId as any);
      // Send a POST request to the PHP script
      const response = await fetch('http://192.168.1.200/api/profile/changeprofileimg', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const textResponse = await response.text();

      try {
        const jsonResponse = JSON.parse(textResponse); 
        if (jsonResponse.success) {
          Alert.alert("Success", jsonResponse.message);
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            profilePicture: result.assets[0].uri,
          }));
          setProfileImage(result.assets[0].uri);
        } else {
          alert(jsonResponse.message);
        }
      } catch (error) {
        console.error('JSON Parse error:', error);
        alert('Received non-JSON response: ' + textResponse);
      }

    }
  };
  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prevState => ({
      ...prevState,
      [field]: value,
    }));

    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: '',
    }));
  };

  const validatePersonalInfo = () => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};
    let isValid = true;

    if (!userInfo.fname) {
      newErrors.fname = 'First name is required.';
      isValid = false;
    }
    if (!userInfo.lname) {
      newErrors.lname = 'Last name is required.';
      isValid = false;
    }
    if (!userInfo.username) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }

    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    return isValid;
  };

  const validateContactInfo = () => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};
    let isValid = true;

    if (!userInfo.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      newErrors.email = 'Email address is invalid.';
      isValid = false;
    }
    if (!userInfo.contact) {
      newErrors.contact = 'Contact number is required.';
      isValid = false;
    }

    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    return isValid;
  };

  const validateSecurityInfo = () => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {};
    let isValid = true;

    if (!userInfo.oldpassword) {
      newErrors.oldpassword = 'Old password is required.';
      isValid = false;
    }
    if (!userInfo.password) {
      newErrors.password = 'New password is required.';
      isValid = false;
    }
    if (userInfo.password !== userInfo.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
    return isValid;
  };

  const updatePersonalInfo = async () => {
    if (validatePersonalInfo()) {
      try {
        const response = await axios.post('http://192.168.1.200/api/profile/changepersonalinfo', {
          id: userId,
          fname: userInfo.fname,
          mname: userInfo.mname,
          lname: userInfo.lname,
          username: userInfo.username,
        });

        if (response.data.success) {
          // Update user info in context
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            fname: userInfo.fname,
            mname: userInfo.mname,
            lname: userInfo.lname,
            username: userInfo.username,
          }));
          Alert.alert("Success", response.data.message);
        } else {
          Alert.alert("Error", response.data.message || "Failed to update personal information.");
        }
      } catch (error) {
        console.error('Error updating personal info', error);
        Alert.alert("Network Error", "There was a problem connecting to the server. Please try again later.");
      }
    }
  };

  const updateContactInfo = async () => {
    if (validateContactInfo()) {
      try {
        const response = await axios.post('http://192.168.1.200/api/profile/changecontact', {
          id: userId,
          contact: userInfo.contact,
          address: userInfo.address,
          email: userInfo.email,
        });

        if (response.data.success) {
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            contact: userInfo.contact,
            address: userInfo.address,
            email: userInfo.email,
          }));
          Alert.alert("Success", response.data.message);
        } else {
          Alert.alert("Error", response.data.message || "Failed to update contact information.");
        }
      } catch (error) {
        console.error('Error updating contact info', error);
        Alert.alert("Network Error", "There was a problem connecting to the server. Please try again later.");
      }
    }
  };

  const updatePassword = async () => {
    if (validateSecurityInfo()) {
      try {
        const response = await axios.post('http://192.168.1.200/api/profile/changepassword', {
          id: userId,
          oldpassword: userInfo.oldpassword,
          password: userInfo.password,
        });

        if (response.data.success) {
          Alert.alert("Success", response.data.message);
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            oldpassword: response.data.message || 'Old password is incorrect.',
          }));
          Alert.alert("Error", response.data.message || "Failed to update password.");
        }
      } catch (error) {
        console.error('Error updating password', error);
        Alert.alert("Network Error", "There was a problem connecting to the server. Please try again later.");
      }
    }
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

          {/* Profile Picture Section */}
          <List.Section title="Profile Picture" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
            <TouchableOpacity onPress={pickImage} style={styles.profileContainer}>
              <Image source={{ uri: userInfo.profilePicture }} style={styles.profileImage} />
              <Text style={{ color: currentTheme.textColor }}>Change Profile Picture</Text>
            </TouchableOpacity>
          </List.Section>
          {/* Personal Information Section */}
          <List.Section title="Personal Information" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
            <TextInput
              mode="outlined"
              label="First Name"
              value={userInfo.fname}
              onChangeText={value => handleInputChange('fname', value)}
              error={!!errors.fname}
              style={styles.input}
            />
            {errors.fname ? <Text style={styles.errorText}>{errors.fname}</Text> : null}

            <TextInput
              label="Middle Name"
              mode="outlined"
              value={userInfo.mname}
              onChangeText={value => handleInputChange('mname', value)}
              style={styles.input}
            />

            <TextInput
              label="Last Name"
              mode="outlined"
              value={userInfo.lname}
              onChangeText={value => handleInputChange('lname', value)}
              error={!!errors.lname}
              style={styles.input}
            />
            {errors.lname ? <Text style={styles.errorText}>{errors.lname}</Text> : null}

            <TextInput
              label="Username"
              mode="outlined"
              value={userInfo.username}
              onChangeText={value => handleInputChange('username', value)}
              error={!!errors.username} // Error handling
              style={styles.input}
            />
            {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
          </List.Section>
          <Button mode="contained" onPress={updatePersonalInfo} style={styles.updateButton}>
            Update Personal Info
          </Button>
          <Divider />

          {/* Contact Information Section */}
          <List.Section title="Contact Information" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
            <TextInput
              mode="outlined"
              label="Email"
              value={userInfo.email}
              keyboardType="email-address"
              onChangeText={value => handleInputChange('email', value)}
              error={!!errors.email} // Error handling
              style={styles.input}
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
              mode="outlined"
              label="Contact Number"
              value={userInfo.contact}
              keyboardType="phone-pad"
              onChangeText={value => handleInputChange('contact', value)}
              error={!!errors.contact} // Error handling
              style={styles.input}
            />
            {errors.contact ? <Text style={styles.errorText}>{errors.contact}</Text> : null}

            <TextInput
              mode="outlined"
              label="Address"
              value={userInfo.address}
              onChangeText={value => handleInputChange('address', value)}
              style={styles.input}
            />
          </List.Section>
          <Button mode="contained" onPress={updateContactInfo} style={styles.updateButton}>
            Update Contact
          </Button>
          <Divider />

          {/* Security Section */}
          <List.Section title="Security" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
            <TextInput
              mode="outlined"
              label="Old Password"
              value={userInfo.oldpassword}
              secureTextEntry
              onChangeText={value => handleInputChange('oldpassword', value)}
              error={!!errors.oldpassword} // Error handling
              style={styles.input}
            />
            {errors.oldpassword ? <Text style={styles.errorText}>{errors.oldpassword}</Text> : null}

            <TextInput
              mode="outlined"
              label="Password"
              value={userInfo.password}
              secureTextEntry
              onChangeText={value => handleInputChange('password', value)}
              error={!!errors.password} // Error handling
              style={styles.input}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={userInfo.confirmPassword}
              secureTextEntry
              onChangeText={value => handleInputChange('confirmPassword', value)}
              error={!!errors.confirmPassword} // Error handling
              style={styles.input}
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </List.Section>
          <Button mode="contained" onPress={updatePassword} style={styles.updateButton}>
            Update Password
          </Button>
          <Divider />
          {/* Theme Section */}
          <List.Section title="Application Theme" titleStyle={[styles.sectionTitle, { color: currentTheme.textColor }]}>
            <RadioButton.Group value={theme} onValueChange={handleThemeChange}>
              <RadioButton.Item label="System Default" value="system_default" labelStyle={{ color: currentTheme.textColor }} />
              <RadioButton.Item label="Dark Mode" value="dark_mode" labelStyle={{ color: currentTheme.textColor }} />
              <RadioButton.Item label="Light Mode" value="light_mode" labelStyle={{ color: currentTheme.textColor }} />
            </RadioButton.Group>
            <Divider />
          </List.Section>

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
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  updateButton: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default Settings
