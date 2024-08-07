import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";


const AuthLayout = () => {

  return (
    <>
      <Stack>
        <Stack.Screen
          name="signin"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* <StatusBar backgroundColor="#B6D9D2" style="light" /> */}
    </>
  );
};

export default AuthLayout;