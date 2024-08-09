import { View, Text, Image, ImageSourcePropType, Alert, TouchableNativeFeedback } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { Icons } from '@/constants';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

type TabIconProps = {
  icon: ImageSourcePropType,
  color: string,
  name: string,
  focused: boolean
}



const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {

  return (

    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />


    </View>
  );
};
const TabArr = [
  {
    name: "home",
    title: "Home",
    icon: Icons.home,
  },
  {
    name: "child",
    title: "Child",
    icon: Icons.child,
  },
  {
    name: "create",
    title: "Create",
    icon: Icons.create,
  },
  {
    name: "notification",
    title: "Alert",
    icon: Icons.notif,
  },
  {
    name: "profile",
    title: "Profile",
    icon: Icons.profile,
  },
];
const TabsLayout = () => {
  return (
    <>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: "#759192",
              tabBarInactiveTintColor: "#181818",
              tabBarShowLabel: false,
              tabBarStyle: {
                height: 60,
                position: 'absolute',
                margin: 16,
                borderRadius: 16
              },
            }}
          >
            {TabArr.map((item, index) => (

              <Tabs.Screen
                key={index}
                name={item.name}
                options={{
                  title: item.title,
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => (

                    <View>

                      <TabIcon
                        icon={item.icon}
                        color={color}
                        name={item.title}
                        focused={focused}
                      />
                    </View>

                  ),
                }}
              />
            ))}
          </Tabs>

        </BottomSheetModalProvider>
      </GestureHandlerRootView>



    </>
  );
}

export default TabsLayout