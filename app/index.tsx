import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext'; // Adjust the path as necessary
import CustomButton from '@/components/CustomButton';
import { Images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function App() {
  const { currentTheme } = useTheme(); // Access the current theme

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={currentTheme.applogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Login to Continue"
            handlePress={() => router.push("/sign-in")}
            containerStyles={{ width: '50%', marginTop: 28 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 78,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
});
