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
      </Stack>

      {/* <StatusBar backgroundColor="#B6D9D2" style="light" /> */}
    </ThemeProvider>
  );
};

export default AuthLayout;