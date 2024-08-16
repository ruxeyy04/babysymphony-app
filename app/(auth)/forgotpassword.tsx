import { View, Text, ScrollView, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/hooks/useAppTheme';
import { Images } from '@/constants';
import FormField from '@/components/FormField';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const ForgotPassword = () => {
    const { currentTheme } = useTheme();
    const [form, setForm] = useState({
        email: "",
    });

    const [errors, setErrors] = useState({
        email: "",
    });

    const handleEmailChange = (text: string) => {
        setForm({ ...form, email: text });
        if (text !== "") {
            setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
        }
    };
    const navigation = useNavigation();
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
                    <IconButton
                        icon="chevron-left"
                        size={24}
                        onPress={() => navigation.goBack()}
                        iconColor={`${currentTheme.textColor}`}
                        style={{ backgroundColor: currentTheme.background, borderColor: "#dbdfe3", borderRadius: 10, zIndex: 10 }}
                        className="absolute top-0  border"
                    />
                    <View className="items-center">
                        <Image
                            source={Images.forgotpasswordimage}
                            resizeMode="contain"
                            className="h-[330px] mb-7"
                        />
                    </View>
                    <View className="">
                        <Text
                            className="text-2xl font-semibold mt-10 mb-2 font-psemibold "
                            style={{ color: currentTheme.textColor }}
                        >
                            Forgot Password?
                        </Text>
                        <Text
                            className="font-plight"
                            style={{ color: currentTheme.textColor }}
                        >
                            Don't worry! It occurs. Please enter the email address linked with your account
                        </Text>
                    </View>
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={handleEmailChange}
                        otherStyles="my-6"
                        placeholder="Enter your email"
                        error={errors.email}
                    />
                    <Button
                        onPress={() => {router.replace('/otpverification')}}
                        className="w-full pb-5"
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
                            Send Code
                        </Text>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ForgotPassword