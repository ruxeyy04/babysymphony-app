import React, { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { List, Divider, RadioButton, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext'; // Import the useTheme hook

const themes = {
  light: {
    background: '#EFF8FF',
    appbar: '#D2EBFF',
    textColor: '#2D2D2D',
  },
  dark: {
    background: '#1B1B1F',
    appbar: '#282831',
    textColor: '#D7E0F9',
  }
};

export default function Settings() {
  const navigation = useNavigation();
  const { theme, setTheme } = useTheme(); // Use the ThemeContext
  const deviceColorScheme = useColorScheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    // Load the theme from AsyncStorage when the component mounts
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
  }, [setTheme]);

  const handleThemeChange = async (value: string) => {
    try {
      await AsyncStorage.setItem('app_theme', value);
      setTheme(value);
    } catch (error) {
      console.error('Failed to save theme to AsyncStorage:', error);
    }
  };

  const currentTheme = theme === 'system_default'
    ? (deviceColorScheme === 'dark' ? themes.dark : themes.light)
    : (theme === 'dark_mode' ? themes.dark : themes.light);

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Appbar.Header mode="small" elevated style={{ backgroundColor: currentTheme.appbar }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color={currentTheme.textColor}/>
        <Appbar.Content title="Settings" titleStyle={{ color: currentTheme.textColor }} />
      </Appbar.Header>
      <List.Section title="Application Theme" titleStyle={{ color: currentTheme.textColor }}>
        <RadioButton.Group value={theme} onValueChange={handleThemeChange}>
          <RadioButton.Item
            label="System Default"
            value="system_default"
            labelStyle={{ color: currentTheme.textColor }}
          />
          <RadioButton.Item
            label="Dark Mode"
            value="dark_mode"
            labelStyle={{ color: currentTheme.textColor }}
          />
          <RadioButton.Item
            label="Light Mode"
            value="light_mode"
            labelStyle={{ color: currentTheme.textColor }}
          />
        </RadioButton.Group>
        <Divider />
      </List.Section>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
