import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useTheme } from "@/hooks/useAppTheme";

const Home = () => {
  const { currentTheme } = useTheme();
  const { authData } = useGoogleAuth();
  return (
    <SafeAreaView
      className="flex-1 "
      style={{ backgroundColor: currentTheme.background }}
    >
      <Text>{JSON.stringify(authData)}</Text>
      <View className="items-center justify-center flex-1">
        <Image
          source={currentTheme.applogo}
          className="w-[300px] h-[78px]"
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 justify-center items-center">
        <Text
          className="text-2xl font-bold "
          style={{ color: currentTheme.textColor }}
        >
          Welcome to Home
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
