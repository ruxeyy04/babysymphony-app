import { View, Text, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Images } from '@/constants';

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#1b1b1f]">
      <View className='items-center justify-center flex-1'>
        <Image
          source={Images.logowhite}
          className="w-[300px] h-[78px]"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800">Welcome to Home</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
