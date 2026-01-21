import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useUserStats } from "../hooks/useProgressHooks";
import { getSelectedGrade } from "../services/progress.service";

export default function ProfileScreen() {
  const [grade, setGrade] = useState(1);
  const { stats, totalLessonsCompleted, averageScore } = useUserStats();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadUserData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async () => {
    try {
      const savedGrade = await getSelectedGrade();
      setGrade(savedGrade);
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
      onPress: () => router.push("/leaderboard"),
    },
    { id: "settings", icon: "settings", title: "Cài đặt", color: "#6B7280" },
    { id: "help", icon: "help-circle", title: "Trợ giúp", color: "#3B82F6" },
  ];

  const gradeCharacters: Record<number, { name: string; icon: string }> = {
    1: { name: "Sparky", icon: "🐱" },
    2: { name: "Penny", icon: " Foxes" },
    3: { name: "Ray", icon: "🐼" },
    4: { name: "Dottie", icon: "🦁" },
    5: { name: "Max", icon: "🐻" },
  };

  const character = gradeCharacters[grade] || gradeCharacters[1];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Avatar */}
      <View className="bg-teal-500 pt-16 pb-12 px-6 items-center rounded-b-[40px] shadow-xl">
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: fadeAnim }] }}
          className="w-28 h-28 bg-white rounded-full items-center justify-center mb-4 shadow-2xl overflow-hidden"
        >
          <Text className="text-6xl">{character.icon}</Text>
        </Animated.View>
        <Text className="text-white text-3xl font-black">{character.name}</Text>
        <View className="bg-white/20 px-6 py-1.5 rounded-full mt-3 flex-row items-center border border-white/20">
          <MaterialCommunityIcons name="school" size={18} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Lớp {grade}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
      >
        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between -mt-10 mb-8">
          <StatCard
            icon="⭐"
            value={stats?.totalStarsEarned || 0}
            label="Sao đã nhận"
            color="#FEF3C7"
            textColor="#B45309"
          />
          <StatCard
            icon="📚"
            value={totalLessonsCompleted}
            label="Hoàn thành"
            color="#D1FAE5"
            textColor="#065F46"
          />
          <StatCard
            icon="🔥"
            value={stats?.streak || 0}
            label="Ngày học"
            color="#FEE2E2"
            textColor="#991B1B"
          />
          <StatCard
            icon="🎯"
            value={`${averageScore}%`}
            label="Chính xác"
            color="#DBEAFE"
            textColor="#1E40AF"
          />
        </View>

        {/* Menu Items */}
        <Text className="text-gray-800 text-xl font-black mb-4 px-2">
          Hoạt động
        </Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={item.onPress}
            className="bg-white rounded-3xl p-5 flex-row items-center mb-4 shadow-sm"
          >
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mr-5"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <Feather name={item.icon as any} size={24} color={item.color} />
            </View>
            <Text className="text-gray-900 text-lg font-bold flex-1">
              {item.title}
            </Text>
            <View className="bg-gray-50 w-8 h-8 rounded-full items-center justify-center">
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Login Section */}
        <View className="bg-white rounded-[32px] p-6 mt-4 mb-6 shadow-sm border border-teal-50">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-pink-100 rounded-2xl items-center justify-center mr-4">
              <Text className="text-2xl">🔐</Text>
            </View>
            <View>
              <Text className="text-gray-900 text-lg font-black">
                Lưu lại tiến trình
              </Text>
              <Text className="text-gray-500 text-sm">
                Đăng nhập để thi đấu bạn bè
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-teal-500 rounded-3xl py-4 items-center shadow-lg shadow-teal-500/30"
            activeOpacity={0.8}
          >
            <Text className="text-white font-black text-lg">
              Đăng nhập ngay
            </Text>
          </TouchableOpacity>
        </View>

        {/* Change Grade */}
        <TouchableOpacity
          onPress={handleChangeGrade}
          activeOpacity={0.8}
          className="bg-gray-100/50 rounded-3xl p-5 flex-row items-center justify-center border border-gray-100"
        >
          <Feather name="refresh-cw" size={18} color="#6B7280" />
          <Text className="text-gray-600 font-bold ml-2">Thay đổi lớp học</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
  textColor,
}: {
  icon: string;
  value: string | number;
  label: string;
  color: string;
  textColor: string;
}) {
  return (
    <View
      className="bg-white rounded-3xl p-5 items-center mb-4 shadow-sm"
      style={{
        width: "48%",
        borderWidth: 1,
        borderColor: "#f3f4f6",
      }}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
        style={{ backgroundColor: color }}
      >
        <Text className="text-2xl">{icon}</Text>
      </View>
      <Text
        className="text-gray-900 text-2xl font-black"
        style={{ color: textColor }}
      >
        {value}
      </Text>
      <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
        {label}
      </Text>
    </View>
  );
}
