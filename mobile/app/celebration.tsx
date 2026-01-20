import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CelebrationScreen() {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [bounceAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [starAnims] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  // Mock data - in real app, these would come from props/route params
  const pointsEarned = 50;
  const accuracy = 100;
  const progress = 85;
  const streak = 5;

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
      starAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [scaleAnim, bounceAnim, fadeAnim, starAnims]);

  const handleNextLesson = () => {
    router.push("/(tabs)/lessons");
  };

  const handleBackHome = () => {
    router.push("/(tabs)");
  };

  return (
    <View className="flex-1 items-center justify-center p-5 bg-pink-50">
      {/* Decorative confetti elements */}
      <View className="absolute inset-0 pointer-events-none">
        <View
          className="absolute w-3 h-3 rounded-sm bg-pink-400"
          style={{ top: 40, left: 30 }}
        />
        <View
          className="absolute w-3 h-3 rounded-sm bg-cyan-400"
          style={{ top: 100, right: 50, transform: [{ rotate: "45deg" }] }}
        />
        <View
          className="absolute w-3 h-3 rounded-sm bg-yellow-400"
          style={{ bottom: 200, left: 20 }}
        />
        <View
          className="absolute w-3 h-3 rounded-sm bg-cyan-400"
          style={{ bottom: 100, right: 30, transform: [{ rotate: "30deg" }] }}
        />
      </View>

      {/* Main Content Card */}
      <Animated.View
        className="bg-white rounded-[32px] p-8 w-full max-w-md items-center shadow-2xl"
        style={{ opacity: fadeAnim }}
      >
        {/* Mascot Character with Medal */}
        <Animated.View
          className="relative -mt-20 mb-4"
          style={{
            transform: [{ scale: scaleAnim }, { translateY: bounceAnim }],
          }}
        >
          <View className="w-30 h-30 rounded-full bg-cyan-400 items-center justify-center border-[6px] border-white shadow-lg">
            <Text className="text-6xl">👹</Text>
          </View>
          <View className="absolute -bottom-1 -right-1 w-[50px] h-[50px] rounded-full bg-yellow-400 items-center justify-center border-4 border-white shadow-md">
            <Text className="text-3xl">🏆</Text>
          </View>
        </Animated.View>

        {/* Great Job Title */}
        <Text className="text-[42px] font-black text-pink-600 tracking-wide mb-2 text-center">
          GREAT JOB!
        </Text>
        <Text className="text-lg text-gray-500 font-semibold mb-6">
          Lesson Completed
        </Text>

        {/* Stars */}
        <View className="flex-row gap-4 mb-8">
          {starAnims.map((anim, index) => (
            <Animated.View
              key={index}
              className="w-[60px] h-[60px]"
              style={{
                transform: [{ scale: anim }],
              }}
            >
              <Text className="text-6xl">⭐</Text>
            </Animated.View>
          ))}
        </View>

        {/* Stats Cards */}
        <View className="flex-row gap-4 w-full mb-6">
          {/* Points Earned */}
          <View className="flex-1 bg-pink-50 rounded-3xl p-4 items-center">
            <View className="mb-2">
              <Feather name="zap" size={20} color="#FF1493" />
            </View>
            <Text className="text-[11px] font-bold text-gray-400 tracking-wide mb-1">
              POINTS EARNED
            </Text>
            <Text className="text-3xl font-black text-pink-600">
              +{pointsEarned}
            </Text>
          </View>

          {/* Accuracy */}
          <View className="flex-1 bg-cyan-50 rounded-3xl p-4 items-center">
            <View className="mb-2">
              <Feather name="check-circle" size={20} color="#00BCD4" />
            </View>
            <Text className="text-[11px] font-bold text-gray-400 tracking-wide mb-1">
              ACCURACY
            </Text>
            <Text className="text-3xl font-black text-cyan-500">
              {accuracy}%
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="w-full mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[13px] font-semibold text-gray-600">
              Progress to Next Level
            </Text>
            <Text className="text-[13px] font-bold text-pink-600">
              {progress}%
            </Text>
          </View>
          <View className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-pink-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* Next Lesson Button */}
        <TouchableOpacity
          className="w-full mb-3 rounded-[28px] overflow-hidden bg-pink-600 shadow-lg"
          onPress={handleNextLesson}
          activeOpacity={0.9}
        >
          <View className="flex-row items-center justify-center py-[18px] px-8 gap-2">
            <Text className="text-lg font-extrabold text-white">
              Next Lesson
            </Text>
            <Feather name="arrow-right" size={24} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Back to Home Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-4 px-8 bg-cyan-50 rounded-[28px] w-full gap-2"
          onPress={handleBackHome}
          activeOpacity={0.8}
        >
          <Feather name="home" size={20} color="#4DD0E1" />
          <Text className="text-base font-bold text-cyan-400">
            Back to Home
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Streak Notification */}
      <View className="flex-row items-center gap-1.5 mt-5 px-4 py-2 bg-white rounded-2xl shadow-md">
        <MaterialCommunityIcons name="fire" size={18} color="#FFA726" />
        <Text className="text-[13px] font-semibold text-gray-500">
          You&apos;re on a {streak}-day streak!
        </Text>
      </View>
    </View>
  );
}
