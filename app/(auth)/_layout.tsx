import { ThemeProvider } from "@/context/ThemeContext";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const AuthLayout = () => {

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="forgotpassword"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="otpverification"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="newpassword"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ThemeProvider>


  );
};

export default AuthLayout;