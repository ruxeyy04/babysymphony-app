import { Link, router } from "expo-router";
import { Text, View, ScrollView, Image, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField"; // Import the FormField component
import { useState } from "react";
import { useTheme } from "@/hooks/useAppTheme";
import { Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; 
const SignUp = () => {
  const navigation = useNavigation();
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

  const submit = async () => {
    if (validate()) {
      try {
        const response = await axios.post('http://192.168.1.200/api/register', {
          username: form.username,
          email: form.email,
          password: form.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data.status)
        if (response.data.status == "success") {
          Alert.alert("Success", "Registration successful");
          router.push("/sign-in"); 
        } else {
          Alert.alert("Registration Failed", response.data.message || "Please try again");
          
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred during registration");
        console.log(error)
      }
    }
  };
  
  const { currentTheme } = useTheme();

  return (
    <SafeAreaView
      className="h-full"
      style={{ backgroundColor: currentTheme.background }}
    >
      <ScrollView>
        <View
          className="flex justify-center w-full h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <IconButton
            icon="chevron-left"
            size={24}
            onPress={() => navigation.goBack()}
            iconColor={`${currentTheme.textColor}`}
            style={{ backgroundColor: currentTheme.background, borderColor: "#dbdfe3", borderRadius: 10 }}
            className="absolute top-0 border"
          />
          <View className="items-center">
            <Image
              source={currentTheme.applogo}
              resizeMode="contain"
              className="w-[150px] h-[50px] mb-1"
            />
          </View>

          <View className="mb-4">
            <Text
              className="mt-10 text-2xl font-semibold font-psemibold "
              style={{ color: currentTheme.textColor }}
            >
              Register
            </Text>
            <Text
              className="font-plight"
              style={{ color: currentTheme.textColor }}
            >
              Enter Your Personal Information{" "}
            </Text>
          </View>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(text) => handleChange("username", text)}
            otherStyles="mt-7"
            placeholder="Username"
            error={errors.username}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(text) => handleChange("email", text)}
            otherStyles="mt-7"
            placeholder="Email"
            error={errors.email}
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(text) => handleChange("password", text)}
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
              Register
            </Text>
          </Button>

          <View className="flex flex-row justify-center gap-2 py-5">
            <Text
              className="text-lg font-pregular"
              style={{ color: currentTheme.textColor }}
            >
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold "
              style={{ color: currentTheme.textColor }}
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
