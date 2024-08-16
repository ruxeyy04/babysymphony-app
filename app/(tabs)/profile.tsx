import React, { useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Platform,
  Alert,
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
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import * as Notifications from "expo-notifications";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { clearAuthData } = useGoogleAuth();

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
      await clearAuthData();
      notification("Success", "Successfully logged-out");
      router.push("/sign-in");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log('handleSheetChanges', index);
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
    <View className="flex-1 justify-center items-center bg-primary">
      <CustomButton
        title="Profile Menu"
        handlePress={handlePresentModalPress}
        containerStyles="w-1/2 mt-[26px]"
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        enableDynamicSizing={true} // Enable dynamic sizing
        onChange={handleSheetChanges}
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
            onPress={handleSignOut} // Passing handleSignOut as a prop
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

type MenuProps = {
  icon: any;
  label: string;
  onPress: () => void; // Added onPress as a prop
};

const MenuItem = ({ icon, label, onPress }: MenuProps) => (
  <TouchableNativeFeedback
    background={TouchableNativeFeedback.Ripple("#ddd", false)}
    onPress={onPress}
  >
    <View style={styles.menuItem}>
      {icon}
      <Text className="ml-[10px] text-[16px] font-pmedium text-[#333]">
        {label}
      </Text>
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  bottomSheetView: {},
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
});

export default Profile;
