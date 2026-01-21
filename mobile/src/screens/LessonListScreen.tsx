import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Mock data for all lessons organized by category
const lessonCategories = [
  {
    id: "numbers",
    title: "🔢 Số và Đếm",
    lessons: [
      {
        id: "1-10",
        number: "LESSON 1-10",
        title: "Đếm từ 1 đến 10",
        icon: "🔢",
        iconBg: "#FEF3C7",
        progress: 100,
        unlocked: true,
        stars: 3,
      },
      {
        id: "1-11",
        number: "LESSON 1-11",
        title: "Đếm từ 10 đến 20",
        icon: "🔟",
        iconBg: "#DBEAFE",
        progress: 80,
        unlocked: true,
        stars: 2,
      },
      {
        id: "1-12",
        number: "LESSON 1-12",
        title: "So sánh số",
        icon: "⚖️",
        iconBg: "#FCE7F3",
        progress: 0,
        unlocked: true,
        stars: 0,
      },
    ],
  },
  {
    id: "addition",
    title: "➕ Phép Cộng",
    lessons: [
      {
        id: "1-20",
        number: "LESSON 1-20",
        title: "Cộng đơn giản",
        icon: "➕",
        iconBg: "#FEE2E2",
        progress: 40,
        unlocked: true,
        stars: 1,
      },
      {
        id: "1-21",
        number: "LESSON 1-21",
        title: "Cộng trong phạm vi 10",
        icon: "🧮",
        iconBg: "#D1FAE5",
        progress: 0,
        unlocked: true,
        stars: 0,
      },
      {
        id: "1-22",
        number: "LESSON 1-22",
        title: "Number Bonds",
        icon: "🔗",
        iconBg: "#E0E7FF",
        progress: 0,
        unlocked: false,
        stars: 0,
      },
    ],
  },
  {
    id: "subtraction",
    title: "➖ Phép Trừ",
    lessons: [
      {
        id: "1-30",
        number: "LESSON 1-30",
        title: "Trừ đơn giản",
        icon: "➖",
        iconBg: "#FED7AA",
        progress: 0,
        unlocked: false,
        stars: 0,
      },
      {
        id: "1-31",
        number: "LESSON 1-31",
        title: "Trừ trong phạm vi 10",
        icon: "🎯",
        iconBg: "#FBCFE8",
        progress: 0,
        unlocked: false,
        stars: 0,
      },
    ],
  },
  {
    id: "geometry",
    title: "📐 Hình Học",
    lessons: [
      {
        id: "1-40",
        number: "LESSON 1-40",
        title: "Shape Hunter",
        icon: "🔺",
        iconBg: "#DBEAFE",
        progress: 10,
        unlocked: true,
        stars: 0,
      },
      {
        id: "1-41",
        number: "LESSON 1-41",
        title: "Pattern Master",
        icon: "📊",
        iconBg: "#FEF3C7",
        progress: 0,
        unlocked: false,
        stars: 0,
      },
    ],
  },
];

export default function LessonListScreen() {
  const [grade, setGrade] = useState(1);

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

  const handleLessonPress = (lesson: any) => {
    if (lesson.unlocked) {
      router.push(`/lesson-detail?lessonId=${lesson.id}`);
    }
  };

  const renderStars = (stars: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3].map((i) => (
          <Text
            key={i}
            className={`text-sm ${stars >= i ? "opacity-100" : "opacity-30"}`}
          >
            ⭐
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-teal-500 pt-14 pb-6 px-6">
        <Text className="text-white text-2xl font-bold">
          📚 Danh sách bài học
        </Text>
        <Text className="text-teal-100 text-base mt-1">
          Lớp {grade} •{" "}
          {lessonCategories.reduce((acc, cat) => acc + cat.lessons.length, 0)}{" "}
          bài học
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
      >
        {lessonCategories.map((category) => (
          <View key={category.id} className="mb-6">
            {/* Category Title */}
            <Text className="text-gray-800 text-lg font-bold mb-3">
              {category.title}
            </Text>

            {/* Lessons List */}
            {category.lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                onPress={() => handleLessonPress(lesson)}
                activeOpacity={0.8}
                className="mb-3"
              >
                <View
                  className={`bg-white rounded-2xl p-4 flex-row items-center ${
                    !lesson.unlocked ? "opacity-60" : ""
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {/* Icon */}
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: lesson.iconBg }}
                  >
                    <Text className="text-2xl">{lesson.icon}</Text>
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <Text className="text-gray-400 text-xs font-semibold mb-1">
                      {lesson.number}
                    </Text>
                    <Text className="text-gray-900 text-base font-bold mb-1">
                      {lesson.title}
                    </Text>
                    {lesson.unlocked && renderStars(lesson.stars)}
                  </View>

                  {/* Status */}
                  <View className="items-center">
                    {lesson.unlocked ? (
                      lesson.progress > 0 ? (
                        <View className="items-center">
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
                        </View>
                      ) : (
                        <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center">
                          <Feather name="play" size={18} color="#14B8A6" />
                        </View>
                      )
                    ) : (
                      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                        <Feather name="lock" size={16} color="#9CA3AF" />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Bottom spacing */}
        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
