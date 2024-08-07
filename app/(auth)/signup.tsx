import { Redirect, router, Link } from "expo-router";
import { Text, View, ScrollView, Image, Alert, Dimensions } from 'react-native';
import { Images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/Button';
import FormField from '@/components/FormField';  // Import the FormField component
import { useState } from "react";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (value) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors: any = {};

    if (!form.username) {
      newErrors.username = "This field is required";
      valid = false;
    }
    if (!form.email) {
      newErrors.email = "This field is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }
    if (!form.password) {
      newErrors.password = "This field is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submit = () => {
    if (validate()) {
      Alert.alert("Testing", "Heheheh");
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={Images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px] mb-4"
          />

          <Text className="text-2xl font-semibold text-black mt-10 font-psemibold mb-10">
            Register to LullaBy
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(text) => handleChange('username', text)}
            otherStyles="mt-7"
            placeholder="Username"
            error={errors.username}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => handleChange('email', text)}
            otherStyles="mt-7"
            placeholder="Email"
            error={errors.email}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => handleChange('password', text)}
            otherStyles="mt-7"
            placeholder="Password"
            secureTextEntry={true}
            error={errors.password}
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-black-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/signin"
              className="text-lg font-psemibold text-secondary-200"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignUp;