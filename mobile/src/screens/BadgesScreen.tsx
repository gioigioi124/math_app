import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useUserStats } from "../hooks/useProgressHooks";

// Mock data for badges
const earnedBadges = [
  {
    id: "1",
    icon: "🏆",
    title: "First Win",
    desc: "Hoàn thành bài đầu tiên",
    color: "#FEF3C7",
  },
  {
    id: "2",
    icon: "⭐",
    title: "Star Collector",
    desc: "Thu thập 10 sao",
    color: "#E0F2FE",
  },
  {
    id: "3",
    icon: "🔥",
    title: "On Fire",
    desc: "Học 3 ngày liên tiếp",
    color: "#FEE2E2",
  },
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

const avatars = [
  { id: "a1", icon: "🐱", price: 50, owned: true },
  { id: "a2", icon: "🦊", price: 75, owned: false },
  { id: "a3", icon: "🐼", price: 100, owned: false },
  { id: "a4", icon: "🦁", price: 150, owned: false },
  { id: "a5", icon: "🐰", price: 80, owned: false },
  { id: "a6", icon: "🐻", price: 120, owned: false },
];

export default function BadgesScreen() {
  const { stats } = useUserStats();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-500 pt-16 pb-8 px-6 rounded-b-[40px] shadow-xl">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-3xl font-black">Cửa hàng</Text>
            <Text className="text-teal-100 font-bold">Huy hiệu & Avatars</Text>
          </View>
          <View className="bg-white/20 px-5 py-2.5 rounded-2xl flex-row items-center border border-white/20">
            <Text className="text-2xl mr-2">⭐</Text>
            <Text className="text-white font-black text-xl">
              {stats?.totalStarsEarned || 0}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
      >
        {/* Earned Badges */}
        <Text className="text-gray-800 text-xl font-black mb-4 px-2">
          🎖️ Huy hiệu đã đạt
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8"
        >
          {earnedBadges.map((badge) => (
            <Animated.View
              key={badge.id}
              style={{
                opacity: fadeAnim,
                width: 140,
                backgroundColor: "white",
              }}
              className="bg-white rounded-3xl p-5 mr-4 items-center shadow-sm"
            >
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: badge.color }}
              >
                <Text className="text-4xl">{badge.icon}</Text>
              </View>
              <Text
                className="text-gray-900 font-bold text-center text-sm mb-1"
                numberOfLines={1}
              >
                {badge.title}
              </Text>
              <Text className="text-gray-400 text-[10px] text-center font-medium leading-tight">
                {badge.desc}
              </Text>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Avatar Shop */}
        <Text className="text-gray-800 text-xl font-black mb-4 px-2">
          🎨 Shop Avatars
        </Text>
        <View className="flex-row flex-wrap justify-between mb-8">
          {avatars.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              activeOpacity={0.8}
              className="mb-4"
              style={{ width: "48%" }}
            >
              <View
                className={`bg-white rounded-[32px] p-6 items-center shadow-sm border-2 ${
                  avatar.owned
                    ? "border-teal-500 bg-teal-50/30"
                    : "border-transparent"
                }`}
              >
                <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4 border border-gray-100">
                  <Text className="text-5xl">{avatar.icon}</Text>
                </View>
                {avatar.owned ? (
                  <View className="bg-teal-500 px-4 py-1.5 rounded-full flex-row items-center">
                    <Feather name="check" size={14} color="white" />
                    <Text className="text-white text-xs font-black ml-1">
                      Đã sở hữu
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-100 px-4 py-2 rounded-full flex-row items-center border border-gray-200">
                    <Text className="text-base mr-1">⭐</Text>
                    <Text className="text-gray-800 font-black text-sm">
                      {avatar.price}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Locked Badges */}
        <Text className="text-gray-800 text-xl font-black mb-4 px-2">
          🔒 Huy hiệu chưa mở
        </Text>
        <View className="flex-row flex-wrap justify-between mb-10">
          {availableBadges.map((badge) => (
            <View
              key={badge.id}
              className="bg-white/40 rounded-3xl p-5 mb-4 items-center border border-gray-100"
              style={{ width: "48%" }}
            >
              <View className="opacity-30 mb-3 grayscale">
                <Text className="text-4xl">{badge.icon}</Text>
              </View>
              <Text className="text-gray-400 font-bold text-center text-sm shadow-sm">
                {badge.title}
              </Text>
              <Text className="text-gray-300 text-[10px] text-center mt-1 px-1">
                {badge.desc}
              </Text>
              <View className="absolute top-3 right-3 opacity-20">
                <Feather name="lock" size={16} color="black" />
              </View>
            </View>
          ))}
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
