import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  textStyles?: object;
  containerStyles?: object;
  isLoading?: boolean;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  textStyles = {},
  containerStyles = {},
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        containerStyles,
        isLoading && styles.disabled,
      ]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.indicator}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0b69a",
    borderRadius: 12, // 12px rounded-xl
    minHeight: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#161622",
    fontFamily: "Poppins-SemiBold", // Assuming 'font-psemibold' is mapped to this
    fontSize: 18, // 18px corresponds to text-lg
  },
  disabled: {
    opacity: 0.5,
  },
  indicator: {
    marginLeft: 8, // 8px corresponds to ml-2
  },
});

export default CustomButton;
