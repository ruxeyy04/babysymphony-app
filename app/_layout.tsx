import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { router, SplashScreen, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/ThemeContext"; // Adjust the path if necessary
import { GoogleAuthProvider } from "@/context/GoogleAuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, BackHandler } from "react-native";
import { UserProvider } from "../context/UserContext";
import { PaperProvider } from "react-native-paper";
// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const insets = useSafeAreaInsets();
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestPermissions();

    // Handle back button press
    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup the event listener on unmount
    return () => backHandler.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserProvider>
      <ThemeProvider>
        <GoogleAuthProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="[...unmatched]"
              options={{ headerShown: false }}
            />
          </Stack>
        </GoogleAuthProvider>
      </ThemeProvider>

    </UserProvider>

  );
};

export default RootLayout;
