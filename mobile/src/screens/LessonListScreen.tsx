import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { apiService } from "../services/api.service";
import { Lesson } from "../types/lesson.types";

export default function LessonListScreen() {
  const [grade, setGrade] = useState(1);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

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
          icon: "🔢", // Default icon
          iconBg: "#FEF3C7", // Default bg
          progress: 0,
          unlocked: true,
          stars: 0,
          grade: `MATH GRADE ${l.grade}`,
          totalActivities: 1, // Start with 1 as requested
          activities: [],
          description: l.description,
        }),
      );

      setLessons(mappedLessons);
    } catch (error) {
      console.error("Error loading lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    router.push(`/lesson-detail?lessonId=${lesson.id}`);
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
          Lớp {grade} • {lessons.length} bài học
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#14B8A6" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
        >
          {lessons.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-gray-500 text-base">
                Chưa có bài học nào cho lớp này.
              </Text>
            </View>
          ) : (
            lessons.map((lesson) => (
              <TouchableOpacity
                key={lesson.id}
                onPress={() => handleLessonPress(lesson)}
                activeOpacity={0.8}
                className="mb-3"
              >
                <View
                  className="bg-white rounded-2xl p-4 flex-row items-center"
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
                    {renderStars(lesson.stars)}
                  </View>

                  {/* Status */}
                  <View className="items-center">
                    <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center">
                      <Feather name="play" size={18} color="#14B8A6" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Bottom spacing */}
          <View className="h-6" />
        </ScrollView>
      )}
    </View>
  );
}
