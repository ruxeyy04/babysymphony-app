import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps extends TouchableOpacity {
  title: string;
  textStyles?: string;
  containerStyles?: string;
  isLoading?: boolean;
  handlePress: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ title, handlePress, textStyles, containerStyles, isLoading, ...props }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
      {...props}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;