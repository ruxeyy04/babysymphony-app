import { View, Text, ScrollView, Image, Dimensions, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/hooks/useAppTheme';
import { Images } from '@/constants';
import FormField from '@/components/FormField';
import { Button, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { OTPInput } from 'react-native-otp-component';
import { router } from 'expo-router';

const OTPVerification = () => {
    const { currentTheme } = useTheme();

    const navigation = useNavigation();
    const [codes, setCodes] = useState<string[] | undefined>(Array(6).fill(""));
    const refs = Array(6)
        .fill(null)
        .map(() => useRef<TextInput>(null));

    const [errorMessages, setErrorMessages] = useState<string[]>();


    const onChangeCode = (text: string, index: number) => {
        if (text.length > 1) {
            setErrorMessages(undefined);
            const newCodes = text.split("");
            setCodes(newCodes);
            refs[5]!.current?.focus();
            return;
        }
        setErrorMessages(undefined);
        const newCodes = [...codes!];
        newCodes[index] = text;
        setCodes(newCodes);
        if (text !== "" && index < 5) {
            refs[index + 1]!.current?.focus();
        }
    };

    const otpConfig = {
        borderColor: "#e5e7eb",
        backgroundColor: "#ffffff",
        textColor: "#000",
        errorColor: "#dc2626",
        focusColor: "#b3b7fa",
        
    }
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
                            source={Images.OTP_Image}
                            resizeMode="contain"
                            className="h-[340px] mb-7 w-[350px]"
                        />
                    </View>
                    <View className="mb-5">
                        <Text
                            className="text-2xl font-semibold mt-10 mb-2 font-psemibold "
                            style={{ color: currentTheme.textColor }}
                        >
                            OTP Verification
                        </Text>
                        <Text
                            className="font-plight"
                            style={{ color: currentTheme.textColor }}
                        >
                            Enter the verification code we just sent on your email address
                        </Text>
                    </View>
                    <OTPInput
                        codes={codes!}
                        errorMessages={errorMessages}
                        onChangeCode={onChangeCode}
                        refs={refs}
                        config={otpConfig}
                        
                    />
                    <Button
                        onPress={() => {router.replace('/newpassword')}}
                        className="w-fullb mt-5"
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
                            Verify
                        </Text>
                    </Button>
                    <View className="flex justify-center py-5 flex-row gap-2">
                        <Text
                            className="text-[15px] font-pregular"
                            style={{ color: currentTheme.textColor }}
                        >
                            Didn't received code?
                        </Text>
                        <Text className='text-[15px] font-psemibold text-[#426ae1]'>Resend</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default OTPVerification