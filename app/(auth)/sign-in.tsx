import { Link, router } from "expo-router";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { ThemeProvider } from "@/context/ThemeContext";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { fetchGoogleUserProfile } from "@/utils/fetchGoogleUserProfile";
import { Button, IconButton } from "react-native-paper";
import { Icons } from "@/constants";
import { useTheme } from "@/hooks/useAppTheme";

WebBrowser.maybeCompleteAuthSession();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleEmailChange = (text: string) => {
    setForm({ ...form, email: text });
    if (text !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setForm({ ...form, password: text });
    if (text !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    if (form.email === "") {
      newErrors.email = "This field is required";
      isValid = false;
    }
    if (form.password === "") {
      newErrors.password = "This field is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function notification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { data: "goes here", test: { test1: "more data" } },
      },
      trigger: null,
    });
  }

  const submit = () => {
    if (validateForm()) {
      notification("Success", "Successfully logged-in");
      router.push("/home");
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  const { currentTheme } = useTheme(); // Access the current theme

  const { saveAuthData } = useGoogleAuth(); //Access google hook

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "919456774294-utrtr1butbru3dch5o1lh2mmfr083qmj.apps.googleusercontent.com",
    androidClientId:
      "919456774294-h41hclonjcjcrqp7jgioklq0pfm6v0gj.apps.googleusercontent.com",
    webClientId:
      "919456774294-t6hhiivhl7qiga8aimm0cnau5k7qr87p.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      const { authentication } = response;
      const { accessToken } = authentication;

      fetchGoogleUserProfile(accessToken)
        .then((userProfile) => {
          if (userProfile) {
            const authData = {
              accessToken,
              refreshToken: authentication?.refreshToken,
              user: {
                name: userProfile.name,
                email: userProfile.email,
              },
            };

            saveAuthData(authData);
            console.log("Authentication successful, navigating to home...");
            router.replace("/(tabs)/home");
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [response]);

  return (
    <SafeAreaView
      className="h-full"
      style={{ backgroundColor: currentTheme.background }}
    >
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 200,
          }}
        >
          <View className="items-center">
            <Image
              source={currentTheme.applogo}
              resizeMode="contain"
              className="w-[150px] h-[50px] mb-1"
            />
          </View>
          <View className="mb-4">
            <Text
              className="text-2xl font-semibold mt-10 font-psemibold "
              style={{ color: currentTheme.textColor }}
            >
              Login
            </Text>
            <Text
              className="font-plight"
              style={{ color: currentTheme.textColor }}
            >
              Login To Continue Using he App
            </Text>
          </View>

          <FormField
            title="Email or Username"
            value={form.email}
            handleChangeText={handleEmailChange}
            otherStyles="mt-7"
            placeholder="Email/Username"
            error={errors.email}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={handlePasswordChange}
            otherStyles="mt-7"
            placeholder="Password"
            secureTextEntry={true}
            error={errors.password}
          />

          <Button
            onPress={submit}
            className="w-full mt-10"
            style={{ borderRadius: 12 }}
            contentStyle={{
              backgroundColor: "#B3B7FA",
              borderRadius: 12,
              minHeight: 62,
            }}
          >
            <Text
              style={{
                color: "#161622",
                fontFamily: "Poppins-SemiBold",
                fontSize: 18,
              }}
            >
              Login
            </Text>
          </Button>
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text
              style={{ marginHorizontal: 10, color: currentTheme.textColor }}
            >
              Or Login with
            </Text>
            <View style={styles.line} />
          </View>
          <View className="items-center">
            <IconButton
              mode="outlined"
              icon={({ size }) => (
                <Image
                  source={Icons.googleIcon}
                  style={{ width: 30, height: 30, borderRadius: size / 2 }}
                  accessibilityIgnoresInvertColors
                />
              )}
              size={36}
              onPress={() => promptAsync()}
              style={{ backgroundColor: currentTheme.background }}
            />
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text
              className="text-lg font-pregular"
              style={{ color: currentTheme.textColor }}
            >
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold "
              style={{ color: currentTheme.textColor }}
            >
              Register
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
});
export default SignIn;
