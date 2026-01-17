import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { View, Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#14B8A6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <View
              className={`p-2 rounded-full ${focused ? "bg-teal-100" : ""}`}
            >
              <Feather name="home" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: "LESSONS",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <View
              className={`p-2 rounded-full ${focused ? "bg-teal-100" : ""}`}
            >
              <Feather name="book-open" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: "BADGES",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <View
              className={`p-2 rounded-full ${focused ? "bg-teal-100" : ""}`}
            >
              <Feather name="award" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <View
              className={`p-2 rounded-full ${focused ? "bg-teal-100" : ""}`}
            >
              <Feather name="user" color={color} size={24} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
