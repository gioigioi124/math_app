import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

interface CelebrationScreenProps {
  activityTitle?: string;
  starsEarned?: number;
  totalStars?: number;
}

export default function CelebrationScreen() {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Trophy animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, rotateAnim, fadeAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleContinue = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-teal-500 to-teal-600 items-center justify-center px-6">
      {/* Confetti Background Effect */}
      <View className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </View>

      {/* Trophy Animation */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }, { rotate: rotation }],
        }}
        className="mb-8"
      >
        <View className="w-32 h-32 bg-yellow-400 rounded-full items-center justify-center">
          <Text className="text-7xl">🏆</Text>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="items-center w-full"
      >
        <Text className="text-white text-4xl font-bold mb-3 text-center">
          Amazing Work!
        </Text>
        <Text className="text-teal-100 text-xl mb-8 text-center">
          You completed the activity! 🎉
        </Text>

        {/* Stars Earned */}
        <View className="bg-white/20 rounded-3xl p-6 mb-8 w-full">
          <View className="flex-row justify-center mb-4">
            {[1, 2, 3].map((star) => (
              <View key={star} className="mx-2">
                <Text className="text-5xl">⭐</Text>
              </View>
            ))}
          </View>
          <Text className="text-white text-center text-lg font-semibold">
            You earned 3 stars!
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around w-full mb-8">
          <View className="items-center">
            <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mb-2">
              <Feather name="check-circle" size={28} color="#FFF" />
            </View>
            <Text className="text-white text-sm font-semibold">Completed</Text>
          </View>

          <View className="items-center">
            <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mb-2">
              <Feather name="zap" size={28} color="#FFF" />
            </View>
            <Text className="text-white text-sm font-semibold">+50 XP</Text>
          </View>

          <View className="items-center">
            <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mb-2">
              <Feather name="award" size={28} color="#FFF" />
            </View>
            <Text className="text-white text-sm font-semibold">Level Up!</Text>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.8}
          className="bg-white rounded-full py-5 px-12 w-full"
        >
          <Text className="text-teal-600 text-lg font-bold text-center">
            Continue Learning
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
