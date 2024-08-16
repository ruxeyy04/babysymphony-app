import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";

type CustomButtonProps = {
  title: string;
  handlePress: () => void;
  textStyles?: object;
  containerStyles: string;
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
        isLoading && styles.disabled,
      ]}
      disabled={isLoading}
      className={`${containerStyles}`}
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
    backgroundColor: "#B3B7FA",
    borderRadius: 12, 
    minHeight: 62,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#161622",
    fontFamily: "Poppins-SemiBold", 
    fontSize: 18, 
  },
  disabled: {
    opacity: 0.5,
  },
  indicator: {
    marginLeft: 8,
  },
});

export default CustomButton;
