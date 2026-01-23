import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { apiService } from "../services/api.service";
import { Lesson, Activity } from "../types/lesson.types";
import { useLessonProgress } from "../hooks/useProgressHooks";

export default function LessonDetailScreen() {
  const params = useLocalSearchParams();
  const lessonId = params.lessonId as string;

  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const { progressPercent, completedActivities } = useLessonProgress(lessonId);

  useEffect(() => {
    loadLessonData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadLessonData = async () => {
    try {
      setLoading(true);
      const fetchedLesson = await apiService.getLesson(lessonId);

      // Map backend lesson to frontend type
      const mappedLesson: Lesson = {
        id: fetchedLesson._id,
        number: `BÀI HỌC ${fetchedLesson.grade || 1}`,
        title: fetchedLesson.title,
        icon: fetchedLesson.title.includes("Đếm") ? "🦆" : "🔢",
        iconBg: "#FEF3C7",
        progress: 0,
        unlocked: true,
        stars: 0,
        grade: `TOÁN LỚP ${fetchedLesson.grade}`,
        totalActivities: 1,
        description: fetchedLesson.description,
        estimatedMinutes: 5,
        xpReward: fetchedLesson.xpReward,
        activities: [
          {
            id: "final-quiz",
            title: "Bài kiểm tra kiến thức",
            status: "not-started",
            icon: "📝",
            iconBg: "#EC4899",
            color: "#FCE7F3",
            description: "Trả lời các câu hỏi về " + fetchedLesson.title,
            estimatedMinutes: 5,
          },
        ],
      };

      setLessonData(mappedLesson);

      // Animate after loading
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error("Error loading lesson detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityPress = (activity: Activity) => {
    if (activity.status !== "locked") {
      router.push(
        `/activity-content?activityId=${activity.id}&lessonId=${lessonId}`,
      );
    }
  };

  const handleRetryActivity = (activity: Activity) => {
    if (activity.status === "completed") {
      router.push(
        `/activity-content?activityId=${activity.id}&lessonId=${lessonId}&retry=true`,
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#EC4899" />
      </View>
    );
  }

  if (!lessonData) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 text-lg">Không tìm thấy bài học</Text>
      </View>
    );
  }

  const getProgressMessage = () => {
    if (progressPercent >= 80) {
      return "Gần hoàn thành rồi! Cố lên nhé! 🚀";
    } else if (progressPercent >= 40) {
      return "Tiến bộ tuyệt vời! Bạn làm rất tốt! 🌟";
    } else if (progressPercent > 0) {
      return "Khởi đầu tốt lắm! Tiếp tục nào! 💪";
    } else {
      return "Hãy bắt đầu cuộc phiêu lưu thú vị này! 🎯";
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
        {lessonData.description && (
          <Text className="text-sm text-gray-500 text-center mt-1">
            {lessonData.description}
          </Text>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Progress Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-4 mt-4 mb-3"
        >
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
                  Tiến độ của bạn
                </Text>
              </View>
              <Text className="text-pink-500 text-lg font-bold">
                {completedActivities} / {lessonData.totalActivities}
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="bg-white rounded-full h-3 overflow-hidden mb-2">
              <Animated.View
                className="bg-pink-400 h-full rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </View>

            <Text className="text-pink-700 text-sm">
              {getProgressMessage()}
            </Text>

            {lessonData.estimatedMinutes && (
              <View className="flex-row items-center mt-2">
                <Feather name="clock" size={14} color="#BE185D" />
                <Text className="text-pink-700 text-xs ml-1">
                  Thời gian ước tính: {lessonData.estimatedMinutes} phút
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Activities List */}
        <View className="px-4">
          {lessonData.activities.map((activity, index) => (
            <Animated.View
              key={activity.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 50 + index * 10],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
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
                    {activity.description && activity.status !== "locked" && (
                      <Text className="text-xs text-gray-500 mb-1">
                        {activity.description}
                      </Text>
                    )}
                    <View className="flex-row items-center">
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
                          ? "HOÀN THÀNH"
                          : activity.status === "in-progress"
                            ? "ĐANG HỌC"
                            : activity.status === "not-started"
                              ? "BẮT ĐẦU"
                              : "KHÓA"}
                      </Text>
                      {activity.estimatedMinutes &&
                        activity.status !== "locked" && (
                          <>
                            <Text className="text-gray-400 mx-1">•</Text>
                            <Feather name="clock" size={12} color="#9CA3AF" />
                            <Text className="text-xs text-gray-500 ml-1">
                              {activity.estimatedMinutes} phút
                            </Text>
                          </>
                        )}
                    </View>
                    {activity.score !== undefined &&
                      activity.status === "completed" && (
                        <View className="flex-row items-center mt-1">
                          <Feather name="award" size={12} color="#10B981" />
                          <Text className="text-xs text-green-600 ml-1">
                            Điểm: {activity.score}/100
                          </Text>
                          {activity.accuracy !== undefined && (
                            <>
                              <Text className="text-gray-400 mx-1">•</Text>
                              <Text className="text-xs text-green-600">
                                Độ chính xác: {activity.accuracy}%
                              </Text>
                            </>
                          )}
                        </View>
                      )}
                  </View>

                  {/* Action Button */}
                  {activity.status === "completed" ? (
                    <TouchableOpacity
                      onPress={() => handleRetryActivity(activity)}
                      className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center"
                    >
                      <Feather name="rotate-cw" size={18} color="#14B8A6" />
                    </TouchableOpacity>
                  ) : activity.status === "in-progress" ||
                    activity.status === "not-started" ? (
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
            </Animated.View>
          ))}
        </View>

        {/* Master Challenge Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="mx-4 mt-3"
        >
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
                Thử thách cao thủ!
              </Text>
              <Text className="text-yellow-800 text-sm">
                Hoàn thành bài học này để mở khóa Huy hiệu Vàng.
              </Text>
            </View>
            <View className="w-16 h-16 bg-yellow-200 rounded-full items-center justify-center">
              <Text className="text-4xl">🏆</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
