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
import { getActivityById } from "../data/lessons.data";
import { apiService } from "../services/api.service";
import { Activity } from "../types/lesson.types";

export default function ActivityContentScreen() {
  const params = useLocalSearchParams();
  const lessonId = params.lessonId as string;
  const activityId = params.activityId as string;
  const isRetry = params.retry === "true";

  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [slideAnim] = useState(new Animated.Value(20));
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    loadActivityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadActivityData = async () => {
    try {
      setLoading(true);
      // Try local first
      let localActivity = getActivityById(lessonId, activityId);

      if (localActivity) {
        setActivity(localActivity);
      } else {
        // Fetch from backend
        const lesson = await apiService.getLesson(lessonId);
        const fetchedQuestions = await apiService.getLessonQuestions(lessonId);

        setQuestions(fetchedQuestions);

        setActivity({
          id: activityId,
          title: activityId === "final-quiz" ? "Bài kiểm tra" : lesson.title,
          status: "not-started",
          icon: "❓",
          iconBg: "#EC4899",
          color: "#FCE7F3",
          description: lesson.description || "Kiểm tra kiến thức",
          estimatedMinutes: 5,
        });
      }

      // Animate
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error("Error loading activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartActivity = () => {
    // If we have questions, we could show a real quiz here.
    // For this testing phase, we'll just show the questions count and then go to celebration.
    const mockScore = Math.floor(Math.random() * 21) + 80;
    const mockAccuracy = Math.floor(Math.random() * 11) + 90;
    router.push(
      `/celebration?lessonId=${lessonId}&activityId=${activityId}&score=${mockScore}&accuracy=${mockAccuracy}`,
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#EC4899" />
      </View>
    );
  }

  if (!activity) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 text-lg">Không tìm thấy hoạt động</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-6 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <Feather name="chevron-left" size={28} color="#EC4899" />
          </TouchableOpacity>

          <View className="flex-1 mx-4">
            <Text className="text-xs text-pink-500 font-bold text-center">
              {isRetry ? "LUYỆN TẬP LẠI" : "HOẠT ĐỘNG MỚI"}
            </Text>
          </View>

          <TouchableOpacity className="w-10 h-10 items-center justify-center -mr-2">
            <Feather name="help-circle" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Activity Icon & Title */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center mt-8 mb-6"
        >
          <View
            className="w-24 h-24 rounded-3xl items-center justify-center mb-4"
            style={{
              backgroundColor: activity.iconBg,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Text className="text-5xl">{activity.icon}</Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900 text-center px-6">
            {activity.title}
          </Text>

          {activity.description && (
            <Text className="text-base text-gray-600 text-center px-8 mt-2">
              {activity.description}
            </Text>
          )}
        </Animated.View>

        {/* Activity Info Cards */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
          className="px-6 mb-6"
        >
          <View className="flex-row justify-between">
            {/* Time Card */}
            {activity.estimatedMinutes && (
              <View
                className="flex-1 bg-blue-50 rounded-2xl p-4 mr-2"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="items-center">
                  <View className="w-10 h-10 bg-blue-400 rounded-full items-center justify-center mb-2">
                    <Feather name="clock" size={20} color="#FFF" />
                  </View>
                  <Text className="text-xs text-blue-600 font-semibold uppercase mb-1">
                    Thời gian
                  </Text>
                  <Text className="text-lg font-bold text-blue-900">
                    {activity.estimatedMinutes} phút
                  </Text>
                </View>
              </View>
            )}

            {/* Status Card */}
            <View
              className="flex-1 bg-purple-50 rounded-2xl p-4 ml-2"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="items-center">
                <View className="w-10 h-10 bg-purple-400 rounded-full items-center justify-center mb-2">
                  <Feather
                    name={
                      activity.status === "completed"
                        ? "check-circle"
                        : activity.status === "in-progress"
                          ? "play-circle"
                          : "circle"
                    }
                    size={20}
                    color="#FFF"
                  />
                </View>
                <Text className="text-xs text-purple-600 font-semibold uppercase mb-1">
                  Trạng thái
                </Text>
                <Text className="text-sm font-bold text-purple-900 text-center">
                  {activity.status === "completed"
                    ? "Hoàn thành"
                    : activity.status === "in-progress"
                      ? "Đang học"
                      : "Mới"}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Previous Score (if completed) */}
        {activity.status === "completed" && activity.score !== undefined && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
            className="mx-6 mb-6"
          >
            <View
              className="bg-green-50 rounded-3xl p-5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 bg-green-400 rounded-full items-center justify-center mr-3">
                  <Feather name="award" size={20} color="#FFF" />
                </View>
                <Text className="text-gray-900 text-lg font-bold">
                  Kết quả lần trước
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-xs text-green-600 font-semibold uppercase mb-1">
                    Điểm số
                  </Text>
                  <Text className="text-3xl font-bold text-green-700">
                    {activity.score}/100
                  </Text>
                </View>

                {activity.accuracy !== undefined && (
                  <View className="flex-1 items-end">
                    <Text className="text-xs text-green-600 font-semibold uppercase mb-1">
                      Độ chính xác
                    </Text>
                    <Text className="text-3xl font-bold text-green-700">
                      {activity.accuracy}%
                    </Text>
                  </View>
                )}
              </View>

              {isRetry && (
                <View className="mt-3 pt-3 border-t border-green-200">
                  <Text className="text-sm text-green-700 text-center">
                    💪 Hãy cố gắng đạt điểm cao hơn lần này nhé!
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* What You'll Learn */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          }}
          className="mx-6 mb-6"
        >
          <Text className="text-lg font-bold text-gray-900 mb-3">
            📚 Bạn sẽ học được gì?
          </Text>

          <View
            className="bg-white rounded-3xl p-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="flex-row items-start mb-3">
              <View className="w-6 h-6 bg-pink-100 rounded-full items-center justify-center mr-3 mt-0.5">
                <Text className="text-pink-500 font-bold">1</Text>
              </View>
              <Text className="flex-1 text-gray-700">
                Hiểu rõ khái niệm cơ bản
              </Text>
            </View>

            <View className="flex-row items-start mb-3">
              <View className="w-6 h-6 bg-pink-100 rounded-full items-center justify-center mr-3 mt-0.5">
                <Text className="text-pink-500 font-bold">2</Text>
              </View>
              <Text className="flex-1 text-gray-700">
                Thực hành với các ví dụ thú vị
              </Text>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 bg-pink-100 rounded-full items-center justify-center mr-3 mt-0.5">
                <Text className="text-pink-500 font-bold">3</Text>
              </View>
              <Text className="flex-1 text-gray-700">
                Kiểm tra kiến thức đã học
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Backend Questions (Testing) */}
        {questions.length > 0 && (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="mx-6 mb-6"
          >
            <Text className="text-lg font-bold text-gray-900 mb-3">
              ❓ Câu hỏi từ Backend ({questions.length})
            </Text>
            {questions.map((q, index) => (
              <View
                key={q._id}
                className="bg-white rounded-3xl p-5 mb-3"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Text className="text-gray-900 font-bold mb-2">
                  Câu {index + 1}: {q.text}
                </Text>
                {q.answers.map((ans: string, i: number) => (
                  <View
                    key={i}
                    className={`p-3 rounded-xl mb-2 ${
                      i === q.correctIndex ? "bg-green-100" : "bg-gray-50"
                    }`}
                  >
                    <Text
                      className={
                        i === q.correctIndex
                          ? "text-green-700 font-bold"
                          : "text-gray-600"
                      }
                    >
                      {ans} {i === q.correctIndex ? "✅" : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </Animated.View>
        )}

        {/* Tips Card */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="mx-6 mb-8"
        >
          <View
            className="bg-yellow-50 rounded-3xl p-5 flex-row items-start"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center mr-3">
              <Text className="text-2xl">💡</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 text-base font-bold mb-1">
                Mẹo nhỏ
              </Text>
              <Text className="text-yellow-800 text-sm">
                Hãy đọc kỹ từng câu hỏi và suy nghĩ trước khi trả lời. Không vội
                vàng nhé! 🎯
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Start Button */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
        className="px-6 pb-6 bg-white border-t border-gray-100"
      >
        <TouchableOpacity
          onPress={handleStartActivity}
          activeOpacity={0.8}
          className="bg-pink-500 rounded-2xl py-4 px-6 flex-row items-center justify-center"
          style={{
            shadowColor: "#EC4899",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Feather name="play" size={24} color="#FFF" />
          <Text className="text-white text-lg font-bold ml-2">
            {isRetry ? "Thử lại ngay" : "Bắt đầu học"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
