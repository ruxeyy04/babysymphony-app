import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
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
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import * as Notifications from "expo-notifications";
import { Button, Dialog, Portal } from "react-native-paper";
import { useTheme } from "@/hooks/useAppTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Profile = () => {
  const [visible, setVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { clearAuthData } = useGoogleAuth();

  const userProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+123 456 7890",
    address: "123 Main St, Anytown, USA",
    profilePicture: "https://via.placeholder.com/100", // Placeholder image
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
      await clearUserData(); // Clear user ID from AsyncStorage
      notification("Success", "Successfully logged-out"); // Notify user
      router.push("/"); // Redirect to the sign-in or home screen
    } catch (error) {
      console.error("Failed to sign out", error); // Handle error if any
    }
  };
  
  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('user_id');
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
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: userProfile.profilePicture }}
            style={styles.profilePicture}
          />
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
          <Text style={styles.profilePhone}>{userProfile.phone}</Text>
          <Text style={styles.profileAddress}>{userProfile.address}</Text>
        </View>

        <CustomButton
          title="Profile Menu"
          handlePress={handlePresentModalPress}
          containerStyles="w-1/2 mt-[20px]"
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
            style={styles.dialog}
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
    <View style={styles.menuItem}>
      {icon}
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 20,
    width: "100%",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#666",
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
  },
  profilePhone: {
    fontSize: 16,
    color: "#666",
  },
  profileAddress: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  dialog: {
    backgroundColor: "#ffffff",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  menuLabel: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Profile;
