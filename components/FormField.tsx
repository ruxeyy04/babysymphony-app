import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Icons } from "../constants";
import { ThemeProvider } from "@/context/ThemeContext";
import { useTheme } from "@/hooks/useAppTheme";

interface FormFieldProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  secureTextEntry?: boolean;
  error?: string; // Added error prop
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = "",
  secureTextEntry = false,
  error,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { currentTheme } = useTheme(); // Access the current theme

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text
        className="text-base  font-pmedium"
        style={{ color: currentTheme.textColor }}
      >
        {title}
      </Text>

      <View
        className={`w-full h-16 px-4 bg-white rounded-2xl border-2 ${
          error ? "border-red-500" : "border-gray-200"
        } flex flex-row items-center`}
      >
        <TextInput
          className="flex-1 text-black font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={
            title === "Password" ? !showPassword : secureTextEntry
          }
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? Icons.eye : Icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text> // Error message
      )}
    </View>
  );
};

export default FormField;
