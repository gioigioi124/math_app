import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function ProfileScreen() {
  const [grade, setGrade] = useState(1);
  const [stats] = useState({
    totalStars: 12,
    lessonsCompleted: 3,
    streakDays: 5,
    accuracy: 85,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedGrade = await AsyncStorage.getItem("selectedGrade");
      if (savedGrade) {
        setGrade(parseInt(savedGrade));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleChangeGrade = async () => {
    try {
      await AsyncStorage.multiRemove([
        "hasCompletedOnboarding",
        "selectedGrade",
      ]);
      router.replace("/grade-selection");
    } catch (e) {
      console.error("Error resetting:", e);
    }
  };

  const menuItems = [
    {
      id: "leaderboard",
      icon: "award",
      title: "Bảng xếp hạng",
      color: "#F59E0B",
    },
    { id: "settings", icon: "settings", title: "Cài đặt", color: "#6B7280" },
    { id: "help", icon: "help-circle", title: "Trợ giúp", color: "#3B82F6" },
  ];

  const gradeCharacters: Record<number, { name: string; icon: string }> = {
    1: { name: "Sparky", icon: "🐱" },
    2: { name: "Penny", icon: "🦊" },
    3: { name: "Ray", icon: "🐼" },
    4: { name: "Dottie", icon: "🦁" },
    5: { name: "Max", icon: "🐻" },
  };

  const character = gradeCharacters[grade] || gradeCharacters[1];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Avatar */}
      <View className="bg-teal-500 pt-14 pb-10 px-6 items-center rounded-b-3xl">
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-3 shadow-lg">
          <Text className="text-5xl">{character.icon}</Text>
        </View>
        <Text className="text-white text-2xl font-bold">{character.name}</Text>
        <View className="bg-white/20 px-4 py-1 rounded-full mt-2">
          <Text className="text-white font-medium">Lớp {grade}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
      >
        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between -mt-6 mb-6">
          <View
            className="bg-white rounded-2xl p-4 items-center"
            style={{
              width: "48%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text className="text-3xl mb-1">⭐</Text>
            <Text className="text-gray-900 text-2xl font-bold">
              {stats.totalStars}
            </Text>
            <Text className="text-gray-400 text-sm">Sao</Text>
          </View>

          <View
            className="bg-white rounded-2xl p-4 items-center"
            style={{
              width: "48%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text className="text-3xl mb-1">📚</Text>
            <Text className="text-gray-900 text-2xl font-bold">
              {stats.lessonsCompleted}
            </Text>
            <Text className="text-gray-400 text-sm">Bài học</Text>
          </View>

          <View
            className="bg-white rounded-2xl p-4 items-center mt-3"
            style={{
              width: "48%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text className="text-3xl mb-1">🔥</Text>
            <Text className="text-gray-900 text-2xl font-bold">
              {stats.streakDays}
            </Text>
            <Text className="text-gray-400 text-sm">Ngày liên tiếp</Text>
          </View>

          <View
            className="bg-white rounded-2xl p-4 items-center mt-3"
            style={{
              width: "48%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Text className="text-3xl mb-1">🎯</Text>
            <Text className="text-gray-900 text-2xl font-bold">
              {stats.accuracy}%
            </Text>
            <Text className="text-gray-400 text-sm">Độ chính xác</Text>
          </View>
        </View>

        {/* Menu Items */}
        <Text className="text-gray-800 text-lg font-bold mb-3">Tùy chọn</Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            className="bg-white rounded-2xl p-4 flex-row items-center mb-3"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <Feather name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text className="text-gray-900 text-base font-semibold flex-1">
              {item.title}
            </Text>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        {/* Login Section */}
        <View className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-2xl p-5 mt-4 mb-4">
          <View className="flex-row items-center mb-3">
            <Text className="text-2xl mr-2">🔐</Text>
            <Text className="text-gray-800 text-lg font-bold">
              Đăng nhập để lưu
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mb-4">
            Đăng nhập để lưu tiến độ và cạnh tranh với bạn bè!
          </Text>
          <TouchableOpacity
            className="bg-teal-500 rounded-full py-3 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              Đăng nhập ngay
            </Text>
          </TouchableOpacity>
        </View>

        {/* Change Grade */}
        <TouchableOpacity
          onPress={handleChangeGrade}
          activeOpacity={0.8}
          className="bg-gray-100 rounded-2xl p-4 flex-row items-center justify-center"
        >
          <Feather name="refresh-cw" size={18} color="#6B7280" />
          <Text className="text-gray-600 font-medium ml-2">Đổi lớp học</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
