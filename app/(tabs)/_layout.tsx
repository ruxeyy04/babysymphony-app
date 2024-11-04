import * as React from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  Easing,
  BackHandler,
  Alert
} from 'react-native';
import { Appbar, BottomNavigation, DefaultTheme, Divider, Menu, Provider as PaperProvider, Provider } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '@/hooks/useAppTheme';
import Profile from './profile';
import Home from './home';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Child from './child';
import Create from './create';
import Notif from './notif';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';

import Devices from './device';

type RoutesState = Array<{
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
  color?: string;
  badge?: boolean;
  getAccessibilityLabel?: string;
  getTestID?: string;
}>;

type Route = { route: { key: string } };
type MenuVisibility = {
  [key: string]: boolean | undefined;
};
type Props = {
  navigation: StackNavigationProp<{}>;
};

const BottomNavigationExample = ({ navigation }: Props) => {


  React.useEffect(() => {
    const checkLoginStatus = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        router.replace("/sign-in");
      }
    };

    checkLoginStatus();

    // Handle back button press
    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "YES", onPress: () => BackHandler.exitApp() }
      ]);
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // Cleanup the event listener on unmount
    return () => backHandler.remove();
  }, [navigation]);
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState<RoutesState>([
    {
      key: 'home',
      title: 'Home',
      focusedIcon: 'home',
      ...({ unfocusedIcon: 'home-outline' }),
      color: '#009688'
    },
    {
      key: 'child',
      title: 'Baby',
      focusedIcon: 'account-child',
      ...({ unfocusedIcon: 'account-child-outline' }),
    },
    {
      key: 'device',
      title: 'Device',
      focusedIcon: 'devices',
      ...({ unfocusedIcon: 'devices' }),
    },
    {
      key: 'notif',
      title: 'Alert',
      focusedIcon: 'bell',
      badge: true,
      ...({ unfocusedIcon: 'bell-outline' }),
    },
    {
      key: 'profile',
      title: 'Profile',
      focusedIcon: 'account-circle',
      ...({ unfocusedIcon: 'account-circle-outline' }),
    },
  ]);
  const { currentTheme } = useTheme()
  return (
   
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <View style={styles.screen}>
              <BottomNavigation
                // labeled={false}
                barStyle={{ backgroundColor: currentTheme.appbar }}
                safeAreaInsets={{ bottom: insets.bottom }}
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                labelMaxFontSizeMultiplier={2}
                theme={{ colors: { secondaryContainer: currentTheme.botNav } }}
                renderScene={BottomNavigation.SceneMap({
                  home: Home,
                  child: Child,
                  notif: Notif,
                  profile: Profile,
                  device: Devices
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




  );
};

BottomNavigationExample.title = 'Bottom Navigation';

export default BottomNavigationExample;

const styles = StyleSheet.create({
  ...Platform.select({
    web: {
      content: {
        // there is no 'grid' type in RN :(
        display: 'grid' as 'none',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gridRowGap: '8px',
        gridColumnGap: '8px',
        padding: 8,
      },
      item: {
        width: '100%',
        height: 150,
      },
    },
    default: {
      content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
      },
      item: {
        height: Dimensions.get('window').width / 2,
        width: '50%',
        padding: 4,
      },
    },
  }),
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
  screen: {
    flex: 1,
  },
});
