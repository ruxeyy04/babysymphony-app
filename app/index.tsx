import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from "expo-router";
import { Text, View, ScrollView, Image, StyleSheet } from 'react-native';
import { Images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/Button';

export default function App() {

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={Images.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            title="Login to Continue"
            handlePress={() => router.push("/signin")}
            containerStyles={{ width: '50%', marginTop: 28 }} // You can pass the style object directly
          />
        </View>
      </View>
      {/* <StatusBar backgroundColor="#B6D9D2" style="light" /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#B6D9D2', // 'bg-primary'
    height: '100%', // 'h-full'
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
    marginBottom: 40, // 'mb-10' translates to 10 * 4 = 40px
  },
});
