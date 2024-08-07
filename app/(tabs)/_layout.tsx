import { View, Text, Image, ImageSourcePropType, Alert } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { Icons } from '@/constants';
import { StatusBar } from 'expo-status-bar';

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

      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#181818",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#DEDEDE",
            borderTopWidth: 1,
            borderTopColor: "#f6f6f6",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={Icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />


        <Tabs.Screen
          name="child"
          options={{
            title: "Child",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={Icons.child}
                color={color}
                name="Child"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={Icons.create}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: "Alert",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={Icons.notif}
                color={color}
                name="Alert"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={Icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}

export default TabsLayout