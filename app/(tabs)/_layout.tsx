import * as React from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
  Easing,
} from 'react-native';
import { Appbar, BottomNavigation, Divider, Menu, Provider, useTheme } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';

// Import your components
import Profile from './profile';
import Home from './home';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Child from './child';
import Create from './create';
import Notif from './notif';
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
      title: 'Child',
      focusedIcon: 'account-child',
      ...({ unfocusedIcon: 'account-child-outline' }),
    },
    {
      key: 'create',
      title: 'Create',
      focusedIcon: 'plus-circle',
      color: '#ffffff',
      ...({ unfocusedIcon: 'plus-circle-outline' }),
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

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.screen}>
          <BottomNavigation
            // labeled={false}
            barStyle={{ backgroundColor: '#DDC1C6' }}
            safeAreaInsets={{ bottom: insets.bottom }}
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            labelMaxFontSizeMultiplier={2}
            theme={{ colors: { secondaryContainer: '#78A1B5' } }}
            renderScene={BottomNavigation.SceneMap({
              home: Home,
              child: Child,
              create: Create,
              notif: Notif,
              profile: Profile
            })}
            sceneAnimationEnabled={"opacity" !== undefined}
            sceneAnimationType='opacity'
            sceneAnimationEasing={Easing.ease}
            activeColor='#515E34'
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
