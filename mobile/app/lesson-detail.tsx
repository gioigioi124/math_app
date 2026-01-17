import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Lesson content data structure
const lessonContents: any = {
  "1-10": {
    title: "Lesson 1: Numbers 1-10",
    grade: "MATH GRADE 1",
    totalActivities: 5,
    activities: [
      {
        id: "intro-1-5",
        title: "Introduction to 1-5",
        status: "completed",
        icon: "✓",
        iconBg: "#10B981",
        color: "#D1FAE5",
      },
      {
        id: "counting-practice",
        title: "Counting Practice",
        status: "in-progress",
        icon: "📝",
        iconBg: "#EC4899",
        color: "#FCE7F3",
      },
      {
        id: "intro-6-10",
        title: "Introduction to 6-10",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "basic-addition",
        title: "Basic Addition",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "final-quiz",
        title: "Final Review Quiz",
        status: "locked",
        icon: "❓",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
    ],
  },
  "1-11": {
    title: "Lesson 2: Numbers 10-20",
    grade: "MATH GRADE 1",
    totalActivities: 5,
    activities: [
      {
        id: "intro-10-15",
        title: "Introduction to 10-15",
        status: "completed",
        icon: "✓",
        iconBg: "#10B981",
        color: "#D1FAE5",
      },
      {
        id: "counting-teens",
        title: "Counting Teens",
        status: "in-progress",
        icon: "📝",
        iconBg: "#EC4899",
        color: "#FCE7F3",
      },
      {
        id: "intro-16-20",
        title: "Introduction to 16-20",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "place-value",
        title: "Place Value Basics",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "final-quiz",
        title: "Final Review Quiz",
        status: "locked",
        icon: "❓",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
    ],
  },
  "1-12": {
    title: "Lesson 3: Comparing Numbers",
    grade: "MATH GRADE 1",
    totalActivities: 4,
    activities: [
      {
        id: "greater-less",
        title: "Greater Than & Less Than",
        status: "not-started",
        icon: "⚖️",
        iconBg: "#EC4899",
        color: "#FCE7F3",
      },
      {
        id: "equal-numbers",
        title: "Equal Numbers",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "ordering-practice",
        title: "Ordering Practice",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "final-quiz",
        title: "Final Review Quiz",
        status: "locked",
        icon: "❓",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
    ],
  },
  "1-20": {
    title: "Lesson 4: Simple Addition",
    grade: "MATH GRADE 1",
    totalActivities: 5,
    activities: [
      {
        id: "intro-addition",
        title: "What is Addition?",
        status: "in-progress",
        icon: "➕",
        iconBg: "#EC4899",
        color: "#FEE2E2",
      },
      {
        id: "adding-1-2",
        title: "Adding 1 and 2",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "adding-objects",
        title: "Adding Objects",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "word-problems",
        title: "Word Problems",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "final-quiz",
        title: "Final Review Quiz",
        status: "locked",
        icon: "❓",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
    ],
  },
  "1-21": {
    title: "Lesson 5: Addition Within 10",
    grade: "MATH GRADE 1",
    totalActivities: 5,
    activities: [
      {
        id: "number-bonds",
        title: "Number Bonds",
        status: "not-started",
        icon: "🧮",
        iconBg: "#EC4899",
        color: "#D1FAE5",
      },
      {
        id: "making-10",
        title: "Making 10",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "fact-families",
        title: "Fact Families",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "speed-practice",
        title: "Speed Practice",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "final-quiz",
        title: "Final Review Quiz",
        status: "locked",
        icon: "❓",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
    ],
  },
  "1-40": {
    title: "Lesson 6: Shape Hunter",
    grade: "MATH GRADE 1",
    totalActivities: 4,
    activities: [
      {
        id: "basic-shapes",
        title: "Basic Shapes",
        status: "in-progress",
        icon: "🔺",
        iconBg: "#EC4899",
        color: "#DBEAFE",
      },
      {
        id: "shape-sorting",
        title: "Shape Sorting",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "shape-hunt",
        title: "Shape Hunt Game",
        status: "locked",
        icon: "🔒",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
      {
        id: "final-quiz",
        title: "Final Review Quiz",
        status: "locked",
        icon: "❓",
        iconBg: "#9CA3AF",
        color: "#F3F4F6",
      },
    ],
  },
};

export default function LessonDetailScreen() {
  const params = useLocalSearchParams();
  const lessonId = params.lessonId as string;

  const [progress, setProgress] = useState(0);
  const [completedActivities, setCompletedActivities] = useState(0);

  const lessonData = lessonContents[lessonId] || lessonContents["1-10"];

  useEffect(() => {
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(
        `lesson_progress_${lessonId}`,
      );
      if (savedProgress) {
        const data = JSON.parse(savedProgress);
        setProgress(data.progress || 0);
        setCompletedActivities(data.completed || 0);
      } else {
        // Calculate from activity status
        const completed = lessonData.activities.filter(
          (a: any) => a.status === "completed",
        ).length;
        setCompletedActivities(completed);
        setProgress(Math.round((completed / lessonData.totalActivities) * 100));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleActivityPress = (activity: any) => {
    if (activity.status !== "locked") {
      router.push(
        `/activity-content?activityId=${activity.id}&lessonId=${lessonId}`,
      );
    }
  };

  const handleRetryActivity = (activity: any) => {
    if (activity.status === "completed") {
      console.log("Retry activity:", activity.id);
      // TODO: Navigate to activity with retry mode
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-6 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <Feather name="chevron-left" size={28} color="#EC4899" />
          </TouchableOpacity>

          <TouchableOpacity className="w-10 h-10 items-center justify-center -mr-2">
            <Feather name="more-horizontal" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-pink-500 font-bold mb-1 text-center">
          {lessonData.grade}
        </Text>
        <Text className="text-xl font-bold text-gray-900 text-center">
          {lessonData.title}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Progress Card */}
        <View className="mx-4 mt-4 mb-3">
          <View
            className="bg-pink-50 rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-pink-400 rounded-full items-center justify-center mr-3">
                  <Feather name="star" size={20} color="#FFF" />
                </View>
                <Text className="text-gray-900 text-lg font-bold">
                  Your Progress
                </Text>
              </View>
              <Text className="text-pink-500 text-lg font-bold">
                {completedActivities} of {lessonData.totalActivities}
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="bg-white rounded-full h-3 overflow-hidden mb-2">
              <View
                className="bg-pink-400 h-full rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>

            <Text className="text-pink-700 text-sm">
              {progress >= 80
                ? "Almost halfway! Keep it up, Explorer! 🚀"
                : progress >= 40
                  ? "Great progress! You're doing amazing! 🌟"
                  : "Let's get started on this adventure! 💪"}
            </Text>
          </View>
        </View>

        {/* Activities List */}
        <View className="px-4">
          {lessonData.activities.map((activity: any, index: number) => (
            <TouchableOpacity
              key={activity.id}
              onPress={() => handleActivityPress(activity)}
              activeOpacity={activity.status === "locked" ? 1 : 0.7}
              className="mb-3"
            >
              <View
                className="bg-white rounded-3xl p-4 flex-row items-center"
                style={{
                  backgroundColor:
                    activity.status === "locked" ? "#F9FAFB" : activity.color,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: activity.status === "locked" ? 0.02 : 0.05,
                  shadowRadius: 8,
                  elevation: activity.status === "locked" ? 1 : 2,
                }}
              >
                {/* Icon */}
                <View
                  className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                  style={{
                    backgroundColor:
                      activity.status === "completed"
                        ? "#10B981"
                        : activity.status === "in-progress"
                          ? "#EC4899"
                          : "#E5E7EB",
                  }}
                >
                  {activity.status === "completed" ? (
                    <Feather name="check" size={28} color="#FFF" />
                  ) : activity.status === "locked" ? (
                    <Feather name="lock" size={24} color="#9CA3AF" />
                  ) : (
                    <Text className="text-2xl">{activity.icon}</Text>
                  )}
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text
                    className={`text-base font-bold mb-1 ${
                      activity.status === "locked"
                        ? "text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    {activity.title}
                  </Text>
                  <Text
                    className={`text-xs font-semibold uppercase ${
                      activity.status === "completed"
                        ? "text-green-600"
                        : activity.status === "in-progress"
                          ? "text-pink-600"
                          : "text-gray-400"
                    }`}
                  >
                    {activity.status === "completed"
                      ? "COMPLETED"
                      : activity.status === "in-progress"
                        ? "IN PROGRESS"
                        : "LOCKED"}
                  </Text>
                </View>

                {/* Action Button */}
                {activity.status === "completed" ? (
                  <TouchableOpacity
                    onPress={() => handleRetryActivity(activity)}
                    className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center"
                  >
                    <Feather name="rotate-cw" size={18} color="#14B8A6" />
                  </TouchableOpacity>
                ) : activity.status === "in-progress" ? (
                  <View className="w-12 h-12 bg-pink-500 rounded-full items-center justify-center">
                    <Feather name="play" size={24} color="#FFF" />
                  </View>
                ) : (
                  <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center">
                    <Feather name="lock" size={18} color="#9CA3AF" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Master Challenge Card */}
        <View className="mx-4 mt-3">
          <View
            className="bg-yellow-100 rounded-3xl p-5 flex-row items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View className="flex-1 mr-4">
              <Text className="text-gray-900 text-lg font-bold mb-2">
                Master Challenge!
              </Text>
              <Text className="text-yellow-800 text-sm">
                Finish this lesson to unlock the Golden Badge.
              </Text>
            </View>
            <View className="w-16 h-16 bg-yellow-200 rounded-full items-center justify-center">
              <Text className="text-4xl">🏆</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
