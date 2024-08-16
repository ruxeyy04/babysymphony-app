import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';

import CustomButton from '@/components/CustomButton';
import { Images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';
import { useTheme } from '@/hooks/useAppTheme';

export default function App() {
  const { currentTheme } = useTheme();

  return (
    <SafeAreaView className='h-full' style={{ backgroundColor: currentTheme.background }}>
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={currentTheme.applogo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={Images.landing_image}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl font-bold text-center" style={{ color: currentTheme.textColor }}>
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-[#8284b4]">LullaBy</Text>
            </Text>
          </View>

          <Text className="text-sm font-pregular mt-7 text-center" style={{ color: currentTheme.textColor }}>
            Where Compassion Meets Technology: Embark on a Journey of Care and Innovation with LullaBy, the app that identifies your baby's cry.
          </Text>

          <Button onPress={() => router.push("/sign-in")} className='w-full mt-10' style={{ borderRadius: 12, }} contentStyle={{
            backgroundColor: "#B3B7FA",
            borderRadius: 12,
            minHeight: 62,
          }}>
            <Text style={{
              color: "#161622",
              fontFamily: "Poppins-SemiBold",
              fontSize: 18,
            }}>Login to Continue</Text>
          </Button>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
