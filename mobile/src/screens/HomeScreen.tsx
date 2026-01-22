import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LESSON_CATEGORIES } from "../data/lessons.data";
import { Lesson } from "../types/lesson.types";

export default function HomeScreen() {
  const [grade, setGrade] = useState(1);

  // Lấy danh sách bài học từ data thay vì hardcode
  const lessons = LESSON_CATEGORIES.flatMap((category) => category.lessons);
  const unlockedLessons = lessons.filter((lesson) => lesson.unlocked);
  const displayedLessons = unlockedLessons.length ? unlockedLessons : lessons;

  // Tổng sao và giới hạn tối đa (3 sao mỗi bài)
  const totalStars = displayedLessons.reduce(
    (sum, lesson) => sum + (lesson.stars || 0),
    0,
  );
  const maxStars = Math.max(displayedLessons.length * 3, 1);

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

  const handleSettings = () => {
    // TODO: Navigate to settings
  };

  const handleSeeAll = () => {
    router.push("/(tabs)/lessons");
  };

  const handleLessonPress = (lesson: Lesson) => {
    if (!lesson.unlocked) {
      Alert.alert("Bài học đang khóa", "Hãy hoàn thành bài trước để mở khóa.");
      return;
    }
    router.push(`/lesson-detail?lessonId=${lesson.id}`);
  };

  // Calculate progress percentage
  const progressPercentage = (totalStars / maxStars) * 100;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="bg-teal-500 pt-14 pb-8 px-6 rounded-b-3xl">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-3">
                <Text className="text-2xl">🎓</Text>
              </View>
              <View>
                <Text className="text-white text-xl font-bold">
                  Toán Lớp {grade}
                </Text>
                <Text className="text-teal-100 text-sm font-medium">
                  LEVEL UP!
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => router.push("/celebration")}
                className="w-10 h-10 bg-pink-500 rounded-full items-center justify-center"
              >
                <Text className="text-lg">🎉</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSettings}
                className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
              >
                <Feather name="settings" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        <View className="mx-6 -mt-4 bg-white rounded-2xl p-5 shadow-lg">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-yellow-100 rounded-full items-center justify-center mr-2">
                <Text className="text-lg">⭐</Text>
              </View>
              <Text className="text-gray-800 text-lg font-bold">
                Total Progress
              </Text>
            </View>
            <View className="bg-teal-500 px-3 py-1 rounded-full">
              <Text className="text-white font-bold text-sm">
                {totalStars} / {maxStars} Stars
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
            <View
              className="h-full bg-teal-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </View>

          <View className="flex-row items-center">
            <Text className="text-teal-500 text-sm">✨</Text>
            <Text className="text-teal-500 text-sm font-medium ml-1">
              You're doing great, keep going!
            </Text>
          </View>

          {/* Decorative Star */}
          <View className="absolute right-4 top-4 opacity-20">
            <Ionicons name="star" size={60} color="#14B8A6" />
          </View>
        </View>

        {/* Your Lessons Section */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-2xl font-bold">
              Your Lessons
            </Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text className="text-teal-500 font-semibold text-base">
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lessons Grid */}
          <View className="flex-row flex-wrap justify-between">
            {displayedLessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                onPress={() => handleLessonPress(lesson)}
                activeOpacity={0.8}
                className="w-[48%] mb-4"
              >
                <View
                  className="bg-white rounded-2xl p-4 relative"
                  style={{
                    borderLeftWidth: 4,
                    borderLeftColor: lesson.iconBg,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  {/* Progress or Lock Badge */}
                  <View className="absolute top-3 right-3">
                    {lesson.unlocked ? (
                      lesson.progress > 0 ? (
                        <View
                          className="w-10 h-10 rounded-full items-center justify-center border-2"
                          style={{
                            borderColor:
                              lesson.progress >= 80
                                ? "#10B981"
                                : lesson.progress >= 40
                                  ? "#F59E0B"
                                  : "#E5E7EB",
                          }}
                        >
                          <Text
                            className="text-xs font-bold"
                            style={{
                              color:
                                lesson.progress >= 80
                                  ? "#10B981"
                                  : lesson.progress >= 40
                                    ? "#F59E0B"
                                    : "#9CA3AF",
                            }}
                          >
                            {lesson.progress}%
                          </Text>
                        </View>
                      ) : null
                    ) : (
                      <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                        <Feather name="lock" size={14} color="#9CA3AF" />
                      </View>
                    )}
                  </View>

                  {/* Icon */}
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mb-3"
                    style={{ backgroundColor: lesson.iconBg }}
                  >
                    <Text className="text-2xl">{lesson.icon}</Text>
                  </View>

                  {/* Lesson Info */}
                  <Text className="text-gray-400 text-xs font-semibold mb-1">
                    {lesson.number}
                  </Text>
                  <Text
                    className={`text-base font-bold ${lesson.unlocked ? "text-gray-900" : "text-gray-400"}`}
                    numberOfLines={1}
                  >
                    {lesson.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
