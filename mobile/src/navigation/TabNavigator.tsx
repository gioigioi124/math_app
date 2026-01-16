import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../types/navigation.type";
import { HomeScreen } from "../screens/home/HomeScreen";
import { LessonListScreen } from "../screens/lesson/LessonListScreen";
import { LeaderboardScreen } from "../screens/leaderboard/LeaderboardScreen";
import { ShopScreen } from "../screens/shop/ShopScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { colors } from "../constants/colors";

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => null, // Add icons later
        }}
      />
      <Tab.Screen
        name="Lessons"
        component={LessonListScreen}
        options={{
          tabBarLabel: "Lessons",
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          tabBarLabel: "Leaderboard",
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarLabel: "Shop",
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
};
