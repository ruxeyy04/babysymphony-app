import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { Button, Dialog, Portal } from "react-native-paper";
import { useTheme } from "@/hooks/useAppTheme";

const Profile = () => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
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
      router.push("/");
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
  const { currentTheme } = useTheme();
  return (
    <>
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: currentTheme.background }}>
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
              onPress={() => { setVisible(true) }}
            />
          </BottomSheetView>
        </BottomSheetModal>

      </View>
      <Portal>
        <Dialog onDismiss={() => setVisible(false)} visible={visible} style={{backgroundColor: currentTheme.background}}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title className="text-center" style={{color: currentTheme.textColor}}>Logout Confirmation</Dialog.Title>
          <Dialog.Content className="text-center" >
            <Text style={{color: currentTheme.textColor}}>Before logging out, please note that we are currently unable to notify you about all the new updates regarding your baby's cry feelings. Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>
              Cancel
            </Button>
            <Button onPress={() => {
            router.replace('/')
            }}>
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>
    </>

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
