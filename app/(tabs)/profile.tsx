import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableNativeFeedback,
  Platform,
  Alert,
  Image,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as Notifications from "expo-notifications";
import { Button, Dialog, Portal } from "react-native-paper";
import { useTheme } from "@/hooks/useAppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+123 456 7890",
    address: "123 Main St, Anytown, USA",
    profilePicture: "https://via.placeholder.com/100",
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

  const handleSignOut = async () => {
    try {
      await clearUserData();
      notification("Success", "Successfully logged-out");
      router.push("/");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem("user_id");
    } catch (error) {
      console.error("Failed to clear auth data", error);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <>
      <View className="items-center justify-center flex-1 p-4">
        <View className="items-center p-5 bg-[#1f1f1f] rounded-lg shadow-md shadow-black mb-5 w-full">
          <Image
            source={{ uri: userProfile.profilePicture }}
            className="w-24 h-24 mb-3 rounded-full"
          />
          <Text className="mb-1 text-2xl font-bold text-gray-500">
            {userProfile.name}
          </Text>
          <Text className="text-lg text-gray-500">{userProfile.email}</Text>
          <Text className="text-lg text-gray-500">{userProfile.phone}</Text>
          <Text className="mt-1 text-lg text-center text-gray-500">
            {userProfile.address}
          </Text>
        </View>

        <CustomButton
          title="Profile Menu"
          handlePress={handlePresentModalPress}
          containerStyles="w-1/2 mt-5"
        />

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          enableDynamicSizing={true}
          backdropComponent={renderBackdrop}
        >
          <BottomSheetView
            style={{
              paddingBottom: Platform.OS === "ios" ? insets.bottom - 12 : 0,
            }}
          >
            <MenuItem
              icon={<Ionicons name="settings-outline" size={24} />}
              label="Profile Setting"
              onPress={() => router.push("/settings")}
            />
            <MenuItem
              icon={<Ionicons name="exit-outline" size={24} color="#fc0313" />}
              label="Logout"
              onPress={() => setVisible(true)}
            />
          </BottomSheetView>
        </BottomSheetModal>

        <Portal>
          <Dialog
            onDismiss={() => setVisible(false)}
            visible={visible}
            style={{ backgroundColor: "#ffffff" }}
          >
            <Dialog.Icon icon="alert" />
            <Dialog.Title className="text-center">Logout Confirmation</Dialog.Title>
            <Dialog.Content className="text-center">
              <Text>Are you sure you want to logout?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)}>Cancel</Button>
              <Button onPress={() => handleSignOut()}>Logout</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </>
  );
};

type MenuProps = {
  icon: any;
  label: string;
  onPress: () => void;
};

const MenuItem = ({ icon, label, onPress }: MenuProps) => (
  <TouchableNativeFeedback
    background={TouchableNativeFeedback.Ripple("#ddd", false)}
    onPress={onPress}
  >
    <View className="flex-row items-center p-4 bg-white">
      {icon}
      <Text className="ml-2 text-lg font-semibold">{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

export default Profile;
