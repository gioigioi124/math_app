import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const MOCK_LEADERBOARD = [
  {
    id: "1",
    name: "Sparky",
    score: 2450,
    stars: 120,
    avatar: "🐱",
    rank: 1,
    isMe: true,
  },
  { id: "2", name: "Penny", score: 2320, stars: 115, avatar: "🦊", rank: 2 },
  { id: "3", name: "Ray", score: 2100, stars: 105, avatar: "🐼", rank: 3 },
  { id: "4", name: "Dottie", score: 1950, stars: 98, avatar: "🦁", rank: 4 },
  { id: "5", name: "Max", score: 1800, stars: 90, avatar: "🐻", rank: 5 },
  { id: "6", name: "Luna", score: 1650, stars: 82, avatar: "🐰", rank: 6 },
  { id: "7", name: "Felix", score: 1500, stars: 75, avatar: "🐯", rank: 7 },
  { id: "8", name: "Bella", score: 1350, stars: 68, avatar: "🐨", rank: 8 },
];

export default function LeaderboardScreen() {
  const [tab, setTab] = useState<"weekly" | "all-time">("weekly");
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const others = MOCK_LEADERBOARD.slice(3);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-500 pt-16 pb-8 px-6 rounded-b-[40px] shadow-xl">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center"
          >
            <Feather name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-black">Bảng xếp hạng</Text>
          <View className="w-12" />
        </View>

        {/* Tab Switcher */}
        <View className="flex-row bg-black/10 p-1 rounded-2xl">
          <TouchableOpacity
            onPress={() => setTab("weekly")}
            className={`flex-1 py-3 rounded-xl items-center ${
              tab === "weekly" ? "bg-white" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                tab === "weekly" ? "text-teal-600" : "text-teal-100"
              }`}
            >
              Tuần này
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("all-time")}
            className={`flex-1 py-3 rounded-xl items-center ${
              tab === "all-time" ? "bg-white" : ""
            }`}
          >
            <Text
              className={`font-bold ${
                tab === "all-time" ? "text-teal-600" : "text-teal-100"
              }`}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Podium */}
        <View className="flex-row justify-center items-end px-6 mt-8 mb-10">
          {/* 2nd Place */}
          <PodiumItem
            user={topThree[1]}
            height={130}
            color="#E5E7EB"
            rank={2}
            delay={200}
          />
          {/* 1st Place */}
          <PodiumItem
            user={topThree[0]}
            height={160}
            color="#FEF3C7"
            rank={1}
            delay={0}
          />
          {/* 3rd Place */}
          <PodiumItem
            user={topThree[2]}
            height={110}
            color="#FFEDD5"
            rank={3}
            delay={400}
          />
        </View>

        {/* List */}
        <View className="px-6">
          <Text className="text-gray-800 text-lg font-black mb-4">
            Thứ hạng khác
          </Text>
          {others.map((user, index) => (
            <Animated.View
              key={user.id}
              style={{ opacity: fadeAnim }}
              className={`flex-row items-center p-4 rounded-3xl mb-3 ${
                user.isMe ? "bg-teal-50 border border-teal-100" : "bg-white"
              } shadow-sm`}
            >
              <Text className="text-gray-400 font-black text-lg w-8">
                {user.rank}
              </Text>
              <View className="w-12 h-12 bg-gray-100 rounded-2xl items-center justify-center mr-4">
                <Text className="text-2xl">{user.avatar}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">
                  {user.name} {user.isMe && "(Bạn)"}
                </Text>
                <View className="flex-row items-center mt-1">
                  <MaterialCommunityIcons
                    name="star"
                    size={14}
                    color="#F59E0B"
                  />
                  <Text className="text-gray-500 text-xs ml-1 font-medium">
                    {user.stars} sao
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-teal-600 font-black text-lg">
                  {user.score}
                </Text>
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                  ĐIỂM
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Me Stats (Bottom Bar) */}
      <View className="bg-white px-6 pt-4 pb-10 border-t border-gray-100 shadow-2xl">
        <View className="flex-row items-center bg-teal-500 rounded-[32px] p-4">
          <Text className="text-white font-black text-lg w-10">1</Text>
          <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center mr-4">
            <Text className="text-2xl">🐱</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-base">Hạng của bạn</Text>
            <Text className="text-teal-100 text-xs">
              Bạn đang đứng thứ nhất!
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white font-black text-xl">2,450</Text>
            <Text className="text-teal-100 text-[10px] font-bold">ĐIỂM</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function PodiumItem({
  user,
  height,
  color,
  rank,
  delay,
}: {
  user: any;
  height: number;
  color: string;
  rank: number;
  delay: number;
}) {
  const [anim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      delay,
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: anim }],
        flex: 1,
        alignItems: "center",
      }}
    >
      <View className="items-center mb-3">
        <View
          className={`w-16 h-16 rounded-3xl items-center justify-center mb-2 shadow-sm ${rank === 1 ? "w-20 h-20" : ""}`}
          style={{ backgroundColor: color }}
        >
          <Text className={`${rank === 1 ? "text-5xl" : "text-4xl"}`}>
            {user.avatar}
          </Text>
          {rank === 1 && (
            <View className="absolute -top-6">
              <MaterialCommunityIcons name="crown" size={32} color="#F59E0B" />
            </View>
          )}
        </View>
        <Text
          className="text-gray-900 font-black text-sm text-center"
          numberOfLines={1}
        >
          {user.name}
        </Text>
        <Text className="text-teal-600 font-bold text-xs">{user.score}</Text>
      </View>
      <View
        className="w-full rounded-t-3xl items-center pt-3"
        style={{ height, backgroundColor: color }}
      >
        <View className="bg-white/40 w-10 h-10 rounded-full items-center justify-center shadow-sm">
          <Text className="text-gray-900 font-black text-lg">{rank}</Text>
        </View>
      </View>
    </Animated.View>
  );
}
