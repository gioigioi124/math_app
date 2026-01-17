import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

// Mock data for badges
const earnedBadges = [
  { id: "1", icon: "🏆", title: "First Win", desc: "Hoàn thành bài đầu tiên" },
  { id: "2", icon: "⭐", title: "Star Collector", desc: "Thu thập 10 sao" },
  { id: "3", icon: "🔥", title: "On Fire", desc: "Học 3 ngày liên tiếp" },
];

const availableBadges = [
  {
    id: "4",
    icon: "🎯",
    title: "Perfect Score",
    desc: "Đạt 100% một bài",
    locked: true,
  },
  {
    id: "5",
    icon: "📚",
    title: "Bookworm",
    desc: "Hoàn thành 10 bài",
    locked: true,
  },
  {
    id: "6",
    icon: "💎",
    title: "Diamond",
    desc: "Thu thập 100 sao",
    locked: true,
  },
  {
    id: "7",
    icon: "🚀",
    title: "Rocket",
    desc: "Học 7 ngày liên tiếp",
    locked: true,
  },
  {
    id: "8",
    icon: "👑",
    title: "Champion",
    desc: "Top 10 bảng xếp hạng",
    locked: true,
  },
];

// Mock data for avatars
const avatars = [
  { id: "a1", icon: "🐱", price: 50, owned: true },
  { id: "a2", icon: "🦊", price: 75, owned: false },
  { id: "a3", icon: "🐼", price: 100, owned: false },
  { id: "a4", icon: "🦁", price: 150, owned: false },
  { id: "a5", icon: "🐰", price: 80, owned: false },
  { id: "a6", icon: "🐻", price: 120, owned: false },
];

export default function BadgesScreen() {
  const totalStars = 12;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-500 pt-14 pb-6 px-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">
            🏆 Badges & Shop
          </Text>
          <View className="bg-white/20 px-4 py-2 rounded-full flex-row items-center">
            <Text className="text-xl mr-1">⭐</Text>
            <Text className="text-white font-bold">{totalStars}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
      >
        {/* Earned Badges */}
        <Text className="text-gray-800 text-lg font-bold mb-3">
          🎖️ Huy hiệu đã đạt
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {earnedBadges.map((badge) => (
            <View
              key={badge.id}
              className="bg-white rounded-2xl p-4 mr-3 items-center"
              style={{
                width: 120,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text className="text-4xl mb-2">{badge.icon}</Text>
              <Text className="text-gray-900 font-bold text-center text-sm">
                {badge.title}
              </Text>
              <Text className="text-gray-400 text-xs text-center mt-1">
                {badge.desc}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Available Badges */}
        <Text className="text-gray-800 text-lg font-bold mb-3">
          🔒 Huy hiệu chưa mở
        </Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {availableBadges.map((badge) => (
            <View
              key={badge.id}
              className="bg-white/60 rounded-2xl p-4 mb-3 items-center"
              style={{ width: "48%" }}
            >
              <View className="opacity-40">
                <Text className="text-3xl mb-2">{badge.icon}</Text>
              </View>
              <Text className="text-gray-400 font-bold text-center text-sm">
                {badge.title}
              </Text>
              <Text className="text-gray-300 text-xs text-center mt-1">
                {badge.desc}
              </Text>
              <View className="absolute top-2 right-2">
                <Feather name="lock" size={14} color="#D1D5DB" />
              </View>
            </View>
          ))}
        </View>

        {/* Avatar Shop */}
        <Text className="text-gray-800 text-lg font-bold mb-3">
          🎨 Shop Avatars
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {avatars.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              activeOpacity={0.8}
              className="mb-3"
              style={{ width: "31%" }}
            >
              <View
                className={`bg-white rounded-2xl p-4 items-center ${
                  avatar.owned ? "border-2 border-teal-500" : ""
                }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Text className="text-4xl mb-2">{avatar.icon}</Text>
                {avatar.owned ? (
                  <View className="bg-teal-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">Owned</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Text className="text-sm mr-1">⭐</Text>
                    <Text className="text-gray-600 font-bold text-sm">
                      {avatar.price}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
