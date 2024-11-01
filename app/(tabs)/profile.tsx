import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  View,
  TouchableNativeFeedback,
  Platform,
  Alert,
  Image,
  useColorScheme,
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
import { Button, Dialog, Portal, Card, PaperProvider, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserContext } from "@/context/UserContext";
import { useTheme } from "@/hooks/useAppTheme";
const themes = {
  light: {
    background: "#EFF8FF",
    appbar: "#D2EBFF",
    textColor: "#2D2D2D",
  },
  dark: {
    background: "#1B1B1F",
    appbar: "#282831",
    textColor: "#D7E0F9",
  },
};
const Profile = () => {
  const [visible, setVisible] = useState(false);
  const { userInfo, handleSignOut } = useUserContext();

  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);


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
  const deviceColorScheme = useColorScheme();
  const { theme, setTheme } = useTheme();
  const currentTheme =
    theme === "system_default"
      ? deviceColorScheme === "dark"
        ? themes.dark
        : themes.light
      : theme === "dark_mode"
        ? themes.dark
        : themes.light;
  return (
      <View className="items-center justify-center flex-1 p-4 " style={{ backgroundColor: currentTheme.background }}>
        <Card style={{ width: "90%", padding: 15, borderRadius: 15, elevation: 4 }}>
          <View className="items-center">
            <Image
              source={{ uri: userInfo.profilePicture }}
              className="w-24 h-24 mb-3 rounded-full"
            />
            <Text className="mb-1 text-2xl font-bold ">
              {userInfo.fname || userInfo.username} {userInfo.lname ? userInfo.lname : ''}
            </Text>
            <Text className="text-lg ">{userInfo.email}</Text>
            <Text className="text-lg ">{userInfo.contact || userInfo.username}</Text>
            <Text className="mt-1 text-lg text-center ">
              {userInfo.address || 'Address not provided'}
            </Text>
          </View>

          <CustomButton
            title="Profile Menu"
            handlePress={handlePresentModalPress}
            containerStyles="w-full mt-5"
          />
        </Card>

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
              onPress={() => setVisible(true) }
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
