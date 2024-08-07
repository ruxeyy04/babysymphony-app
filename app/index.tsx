import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from "expo-router";
import { Text, View, ScrollView, Image } from 'react-native';
import { Images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/Button';

export default function App() {
  return (
    <SafeAreaView className='bg-primary h-full'>
      <View className='flex-1 justify-between'>
        <View className='items-center justify-center flex-1'>
          <Image
            source={Images.logo}
            className="w-[300px] h-[78px]"
            resizeMode="contain"
          />
        </View>

        <View className='items-center mb-10'>
          <CustomButton
            title="Login to Continue"
            handlePress={() => router.push("/signin")}
            containerStyles="w-1/2"
          />
        </View>
      </View>
      {/* <StatusBar backgroundColor="#B6D9D2" style="light" /> */}
    </SafeAreaView>
  );
}
