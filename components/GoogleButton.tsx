import React from "react";
import { TouchableOpacity, Text, Image, View } from "react-native";

type CustomGoogleButtonProps = {
  handlePress: () => void;
  disabled: boolean;
  styles?: string;
};

const CustomGoogleButton = ({
  handlePress,
  disabled,
  styles,
}: CustomGoogleButtonProps) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center py-3 px-5 ${styles} rounded-lg bg-white shadow-md ${
        disabled ? "opacity-50" : ""
      }`}
      onPress={handlePress}
      disabled={disabled}
    >
      <View className="mr-3">
        <Image
          source={require("@/assets/google-icon.png")} // Make sure this path is correct
          className="w-6 h-6"
        />
      </View>
      <Text className="text-black text-lg font-semibold">
        Sign In with Google
      </Text>
    </TouchableOpacity>
  );
};

export default CustomGoogleButton;
