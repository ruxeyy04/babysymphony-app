import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from "expo-router";
import { Text, View, ScrollView, Image } from 'react-native';
import { Images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/Button';
export default function App() {
  return (
    <SafeAreaView className=' bg-primary h-full'>
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className='flex-1 items-center justify-center'>
          <Image
            source={Images.logo}
            className="w-[300px] h-[78px]"
            resizeMode="contain"
          />
          <CustomButton
            title="Login to Continue"
            handlePress={() => router.push("/signin")}
            containerStyles="w-1/2 mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#B6D9D2" style="light" />
    </SafeAreaView>

  );
}
