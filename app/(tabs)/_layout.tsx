import * as React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  Easing,
  BackHandler,
  Alert as RNAlert
} from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

import Home from './home';
import Profile from './profile';
import Child from './child';
import Notif from './notif';
import Devices from './device';

import { useTheme } from '@/hooks/useAppTheme';
import { useUserContext } from '@/context/UserContext';
import { TabNavigationProvider } from '@/context/TabNavigationContext';

type RoutesState = Array<{
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
  color?: string;
  badge?: boolean;
}>;

const BottomNavigationExample = () => {
  const insets = useSafeAreaInsets();
  const { currentTheme } = useTheme();
  const { booleanNotif, setBooleanNotif } = useUserContext();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState<RoutesState>([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
      color: '#009688'
    },
    {
      key: 'child',
      title: 'Baby',
      focusedIcon: 'account-child',
      unfocusedIcon: 'account-child-outline'
    },
    {
      key: 'device',
      title: 'Device',
      focusedIcon: 'devices',
      unfocusedIcon: 'devices'
    },
    {
      key: 'notif',
      title: 'Alert',
      focusedIcon: 'bell',
      unfocusedIcon: 'bell-outline',
      badge: false
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account-circle',
      unfocusedIcon: 'account-circle-outline'
    },
  ]);

  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        router.replace("/sign-in");
      }
    };

    checkLoginStatus();

    const backAction = () => {
      RNAlert.alert("Exit App", "Are you sure you want to exit the app?", [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  const handleIndexChange = (newIndex: number) => {
    const selectedRoute = routes[newIndex].key;
    if (selectedRoute === 'notif') {
      setBooleanNotif(false);  // Reset badge when the Alert tab is selected
    }
    setIndex(newIndex);
  };

  return (
    <TabNavigationProvider value={{ setIndex }}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <View style={styles.screen}>
            <BottomNavigation
              barStyle={{ backgroundColor: currentTheme.appbar }}
              safeAreaInsets={{ bottom: insets.bottom }}
              navigationState={{ index, routes }}
              onIndexChange={handleIndexChange}
              labelMaxFontSizeMultiplier={2}
              theme={{ colors: { secondaryContainer: currentTheme.botNav } }}
              renderScene={BottomNavigation.SceneMap({
                home: Home,
                child: Child,
                profile: Profile,
                device: Devices,
                notif:Notif
              })}
              sceneAnimationEnabled={"opacity" !== undefined}
              sceneAnimationType='opacity'
              sceneAnimationEasing={Easing.ease}
              activeColor={currentTheme.textColor}
              inactiveColor={currentTheme.textColor}
            />
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </TabNavigationProvider>

  );
};

export default BottomNavigationExample;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
