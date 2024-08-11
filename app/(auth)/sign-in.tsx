import { Link, router } from 'expo-router';
import { Alert, Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { Images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { useState } from "react";
import * as Notifications from 'expo-notifications';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

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
        data: { data: 'goes here', test: { test1: 'more data' } },
      },
      trigger: null,
    });
  }
  const submit = () => {
    if (validateForm()) {
      notification("Success", "Successfully logged-in")
      router.push('/home')
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };
  const { currentTheme } = useTheme(); // Access the current theme

  return (
   <ThemeProvider>
    <SafeAreaView className="h-full" style={{backgroundColor: currentTheme.background}}>
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 200,
          }}
        >
          <Image
            source={currentTheme.applogo}
            resizeMode="contain"
            className="w-[115px] h-[34px] mb-4"
          />

          <Text className="text-2xl font-semibold mt-10 font-psemibold mb-10" style={{color: currentTheme.textColor}}>
            Log in to LullaBy
          </Text>

          <FormField
            title="Email or Username"
            value={form.email}
            handleChangeText={handleEmailChange} 
            otherStyles="mt-7"
            placeholder='Email/Username'
            error={errors.email} 
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={handlePasswordChange} 
            otherStyles="mt-7"
            placeholder='Password'
            secureTextEntry={true}
            error={errors.password} 
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles={{marginTop: 20}}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg  font-pregular" style={{color: currentTheme.textColor}}>
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold "
              style={{color: currentTheme.textColor}}
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
   </ThemeProvider>
  );
};

export default SignIn;
