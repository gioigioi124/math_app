import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useUserStats } from "../hooks/useProgressHooks";
import { getActivityById, getLessonById } from "../data/lessons.data";

const { width, height } = Dimensions.get("window");

// Confetti particle component
const ConfettiParticle = ({ delay }: { delay: number }) => {
  const [translateY] = useState(new Animated.Value(-50));
  const [translateX] = useState(new Animated.Value(Math.random() * width));
  const [rotate] = useState(new Animated.Value(0));
  const [initialX] = useState(Math.random() * width);

  const colors = ["#EC4899", "#14B8A6", "#F59E0B", "#8B5CF6", "#EF4444"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height + 50,
        duration: 3000 + Math.random() * 2000,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: initialX + (Math.random() - 0.5) * 100,
        duration: 3000,
        delay,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 360,
          duration: 1000,
          useNativeDriver: true,
        }),
      ),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: 10,
        height: 10,
        backgroundColor: color,
        transform: [
          { translateX },
          { translateY },
          {
            rotate: rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ["0deg", "360deg"],
            }),
          },
        ],
      }}
    />
  );
};

export default function LessonCompleteScreen() {
  const params = useLocalSearchParams();
  const lessonId = params.lessonId as string;
  const activityId = params.activityId as string;
  const score = parseInt(params.score as string) || 0;
  const accuracy = parseInt(params.accuracy as string) || 0;

  const [scaleAnim] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [starAnims] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  const { stats } = useUserStats();
  const activity = getActivityById(lessonId, activityId);
  const lesson = getLessonById(lessonId);

  // Calculate stars based on score
  const starsEarned = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;

  // Calculate points (score + bonus for accuracy)
  const basePoints = score;
  const accuracyBonus = accuracy >= 90 ? 20 : accuracy >= 70 ? 10 : 0;
  const pointsEarned = basePoints + accuracyBonus;

  useEffect(() => {
    // Mascot bounce animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();

    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Stars animation - sequential
    Animated.stagger(
      150,
      starAnims.slice(0, starsEarned).map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [scaleAnim, bounceAnim, fadeAnim, starAnims, starsEarned]);

  const handleNextLesson = () => {
    router.push(`/lesson-detail?lessonId=${lessonId}`);
  };

  const handleBackHome = () => {
    router.push("/(tabs)");
  };

  const getEncouragementMessage = () => {
    if (score >= 90) {
      return "Xuất sắc! Bạn thật tuyệt vời! 🌟";
    } else if (score >= 70) {
      return "Làm tốt lắm! Tiếp tục phát huy! 💪";
    } else if (score >= 50) {
      return "Khá đấy! Cố gắng thêm nhé! 🎯";
    } else {
      return "Đừng bỏ cuộc! Thử lại nhé! 💪";
    }
  };

  const getMascotEmoji = () => {
    if (score >= 90) return "🎉";
    if (score >= 70) return "😊";
    if (score >= 50) return "👍";
    return "💪";
  };

  return (
    <View className="flex-1 items-center justify-center p-5 bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Confetti particles */}
      {score >= 70 && (
        <View className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <ConfettiParticle key={i} delay={i * 50} />
          ))}
        </View>
      )}

      {/* Main Content Card */}
      <Animated.View
        className="bg-white rounded-[32px] p-8 w-full max-w-md items-center"
        style={{
          opacity: fadeAnim,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        {/* Mascot Character with Medal */}
        <Animated.View
          className="relative -mt-20 mb-4"
          style={{
            transform: [{ scale: scaleAnim }, { translateY: bounceAnim }],
          }}
        >
          <View className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 items-center justify-center border-[6px] border-white shadow-xl">
            <Text className="text-7xl">{getMascotEmoji()}</Text>
          </View>
          {starsEarned >= 2 && (
            <View className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-yellow-400 items-center justify-center border-4 border-white shadow-lg">
              <Text className="text-4xl">🏆</Text>
            </View>
          )}
        </Animated.View>

        {/* Title */}
        <Text className="text-4xl font-black text-pink-600 tracking-wide mb-2 text-center">
          {score >= 90 ? "TUYỆT VỜI!" : score >= 70 ? "GIỎI LẮM!" : "CỐ LÊN!"}
        </Text>
        <Text className="text-base text-gray-500 font-semibold mb-2 text-center">
          {activity?.title || "Hoạt động"}
        </Text>
        <Text className="text-sm text-gray-400 mb-6 text-center">
          {getEncouragementMessage()}
        </Text>

        {/* Stars */}
        <View className="flex-row gap-4 mb-8">
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              className="w-16 h-16"
              style={{
                transform: [
                  { scale: index < starsEarned ? starAnims[index] : 0.5 },
                ],
                opacity: index < starsEarned ? 1 : 0.3,
              }}
            >
              <Text className="text-6xl">⭐</Text>
            </Animated.View>
          ))}
        </View>

        {/* Stats Cards */}
        <View className="flex-row gap-4 w-full mb-6">
          {/* Score */}
          <View className="flex-1 bg-pink-50 rounded-3xl p-4 items-center">
            <View className="mb-2">
              <Feather name="award" size={24} color="#EC4899" />
            </View>
            <Text className="text-xs font-bold text-gray-400 tracking-wide mb-1">
              ĐIỂM SỐ
            </Text>
            <Text className="text-3xl font-black text-pink-600">{score}</Text>
          </View>

          {/* Accuracy */}
          <View className="flex-1 bg-cyan-50 rounded-3xl p-4 items-center">
            <View className="mb-2">
              <Feather name="target" size={24} color="#14B8A6" />
            </View>
            <Text className="text-xs font-bold text-gray-400 tracking-wide mb-1">
              CHÍNH XÁC
            </Text>
            <Text className="text-3xl font-black text-cyan-500">
              {accuracy}%
            </Text>
          </View>

          {/* Points */}
          <View className="flex-1 bg-purple-50 rounded-3xl p-4 items-center">
            <View className="mb-2">
              <Feather name="zap" size={24} color="#8B5CF6" />
            </View>
            <Text className="text-xs font-bold text-gray-400 tracking-wide mb-1">
              ĐIỂM THƯỞNG
            </Text>
            <Text className="text-3xl font-black text-purple-600">
              +{pointsEarned}
            </Text>
          </View>
        </View>

        {/* Lesson Progress */}
        {lesson && (
          <View className="w-full mb-6 bg-gray-50 rounded-2xl p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-semibold text-gray-600">
                Tiến độ bài học
              </Text>
              <Text className="text-sm font-bold text-pink-600">
                {lesson.progress}%
              </Text>
            </View>
            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                style={{ width: `${lesson.progress}%` }}
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="w-full gap-3">
          {/* Continue Button */}
          <TouchableOpacity
            className="w-full rounded-3xl overflow-hidden bg-gradient-to-r from-pink-500 to-purple-500"
            onPress={handleNextLesson}
            activeOpacity={0.9}
            style={{
              shadowColor: "#EC4899",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <View className="flex-row items-center justify-center py-5 px-8 gap-2">
              <Text className="text-lg font-extrabold text-white">
                Tiếp tục học
              </Text>
              <Feather name="arrow-right" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* Retry Button (if score < 90) */}
          {score < 90 && (
            <TouchableOpacity
              className="w-full rounded-3xl bg-yellow-50 border-2 border-yellow-300"
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center py-4 px-8 gap-2">
                <Feather name="rotate-cw" size={20} color="#F59E0B" />
                <Text className="text-base font-bold text-yellow-600">
                  Thử lại để đạt 3 sao
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Back to Home */}
          <TouchableOpacity
            className="flex-row items-center justify-center py-4 px-8 bg-gray-50 rounded-3xl w-full gap-2"
            onPress={handleBackHome}
            activeOpacity={0.8}
          >
            <Feather name="home" size={20} color="#6B7280" />
            <Text className="text-base font-bold text-gray-600">
              Về trang chủ
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Streak Notification */}
      {stats && stats.streak > 0 && (
        <View className="flex-row items-center gap-2 mt-6 px-5 py-3 bg-white rounded-2xl shadow-lg">
          <MaterialCommunityIcons name="fire" size={24} color="#FFA726" />
          <Text className="text-sm font-semibold text-gray-700">
            Chuỗi học {stats.streak} ngày! 🔥
          </Text>
        </View>
      )}

      {/* Achievement Badge (if perfect score) */}
      {score === 100 && accuracy === 100 && (
        <View className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg">
          <Text className="text-sm font-bold text-white text-center">
            🏆 Hoàn hảo! Bạn đạt 100% điểm! 🏆
          </Text>
        </View>
      )}
    </View>
  );
}
