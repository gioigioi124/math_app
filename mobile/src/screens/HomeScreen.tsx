import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { apiService } from "../services/api.service";
import { Lesson } from "../types/lesson.types";
import { useProgress } from "../providers/ProgressProvider";

export default function HomeScreen() {
  const { lessonProgressMap, activityProgressMap, userStats } = useProgress();
  const [grade, setGrade] = useState(1);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Map lessons with real progress from provider
  const lessonsWithProgress = lessons.map((lesson) => {
    const prog = lessonProgressMap.get(lesson.id);
    let totalStarsAchieved = 0;
    let activityCount = 0;

    activityProgressMap.forEach((actProg) => {
      if (actProg.lessonId === lesson.id) {
        totalStarsAchieved += actProg.stars || 0;
        activityCount++;
      }
    });

    const lessonStars =
      activityCount > 0 ? Math.floor(totalStarsAchieved / activityCount) : 0;

    return {
      ...lesson,
      progress: prog?.progress || 0,
      stars: lessonStars,
      unlocked: true, // For now keeping them unlocked
    };
  });

  // Calculate live totals
  const totalStars = userStats?.totalStarsEarned || 0;
  // maxStars = (tổng số activity của tất cả lesson) * 3
  const totalActivitiesCount = lessons.reduce(
    (sum, lesson) => sum + (lesson.totalActivities || 1),
    0,
  );
  const maxStars = Math.max(totalActivitiesCount * 3, 1);
  const progressPercentage = Math.min((totalStars / maxStars) * 100, 100);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const savedGrade = await AsyncStorage.getItem("selectedGrade");
      const currentGrade = savedGrade ? parseInt(savedGrade) : 1;
      setGrade(currentGrade);

      const fetchedLessons = await apiService.getLessons(currentGrade);

      // Map backend data to frontend Lesson type
      const mappedLessons: Lesson[] = fetchedLessons.map(
        (l: any, index: number) => ({
          id: l._id,
          number: `LESSON ${index + 1}`,
          title: l.title,
          icon: "🔢",
          iconBg: index % 2 === 0 ? "#FEF3C7" : "#DBEAFE",
          progress: 0,
          unlocked: true,
          stars: 0,
          grade: `MATH GRADE ${l.grade}`,
          totalActivities: l.activities?.length || 1,
          activities: l.activities || [],
          description: l.description,
        }),
      );

      setLessons(mappedLessons);
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#14B8A6" />
      </View>
    );
  }

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
              <View className="bg-white/20 px-3 py-1 rounded-full flex-row items-center border border-white/20">
                <Text className="text-white font-black text-base mr-1">
                  {totalStars}
                </Text>
                <Text className="text-base">⭐</Text>
              </View>
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
                Tiến độ chung
              </Text>
            </View>
            <View className="bg-teal-500 px-3 py-1 rounded-full">
              <Text className="text-white font-bold text-sm">
                {totalStars} / {maxStars} Sao
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
              Bé đang làm rất tốt, cố gắng lên nhé!
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
              Bài học của bé
            </Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text className="text-teal-500 font-semibold text-base">
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>

          {/* Lessons Grid */}
          <View className="flex-row flex-wrap justify-between">
            {lessonsWithProgress.map((lesson) => (
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
