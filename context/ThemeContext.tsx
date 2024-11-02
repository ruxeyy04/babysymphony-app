import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useColorScheme, StatusBar } from "react-native"; // Import StatusBar
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Images } from "@/constants";
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from "react-native-paper";

const themes = {
  light: {
    background: "#EFF8FF",
    appbar: "#D2EBFF",
    textColor: "#2D2D2D",
    applogo: Images.logo,
    botNav: "#B3B7FA",
  },
  dark: {
    background: "#1B1B1F",
    appbar: "#282831",
    textColor: "#D7E0F9",
    applogo: Images.logowhite,
    botNav: "#444559",
  },
};

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  currentTheme: typeof themes.light;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState("system_default");
  const deviceColorScheme = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("app_theme");
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage:", error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("app_theme", theme);
      } catch (error) {
        console.error("Failed to save theme to AsyncStorage:", error);
      }
    };
    saveTheme();
  }, [theme]);

  const currentTheme =
    theme === "system_default"
      ? deviceColorScheme === "dark"
        ? themes.dark
        : themes.light
      : theme === "dark_mode"
      ? themes.dark
      : themes.light;

  const isDarkMode = currentTheme === themes.dark;
  const paperTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  // Update the StatusBar based on the theme
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};
