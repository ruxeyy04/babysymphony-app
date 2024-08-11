import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Images } from '@/constants';

const themes = {
  light: {
    background: '#EFF8FF',
    appbar: '#D2EBFF',
    textColor: '#2D2D2D',
    applogo: Images.logo,
    botNav: '#B3B7FA'
  },
  dark: {
    background: '#1B1B1F',
    appbar: '#282831',
    textColor: '#D7E0F9',
    applogo: Images.logowhite,
    botNav: '#444559'
  }
};

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
  currentTheme: typeof themes.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('system_default');
  const deviceColorScheme = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('app_theme');
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme from AsyncStorage:', error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('app_theme', theme);
      } catch (error) {
        console.error('Failed to save theme to AsyncStorage:', error);
      }
    };
    saveTheme();
  }, [theme]);

  const currentTheme = theme === 'system_default'
    ? (deviceColorScheme === 'dark' ? themes.dark : themes.light)
    : (theme === 'dark_mode' ? themes.dark : themes.light);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
