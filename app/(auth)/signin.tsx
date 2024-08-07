import { StatusBar } from 'expo-status-bar';
import { Redirect, router, Link } from "expo-router";
import { Text, View, ScrollView, Image, Alert, Dimensions } from 'react-native';
import { Images } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/Button';
const SignIn = () => {
  const submit = () => {
    Alert.alert("Testing");
  }
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
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-black mt-10 font-psemibold">
            Log in to LullaBy
          </Text>


          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-black-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/signup"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn