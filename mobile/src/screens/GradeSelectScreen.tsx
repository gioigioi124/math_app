import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { apiService } from "../services/api.service";

interface GradeOption {
  id: number;
  name: string;
  character: string;
  color: string;
  bgColor: string;
  icon: string;
}

const grades: GradeOption[] = [
  {
    id: 1,
    name: "Grade 1",
    character: "Sparky the Square",
    color: "#10B981", // emerald-500
    bgColor: "#D1FAE5", // emerald-100
    icon: "⬛",
  },
  {
    id: 2,
    name: "Grade 2",
    character: "Penny the Pentagon",
    color: "#14B8A6", // teal-500
    bgColor: "#CCFBF1", // teal-100
    icon: "⬟",
  },
  {
    id: 3,
    name: "Grade 3",
    character: "Ray the Radius",
    color: "#F97316", // orange-500
    bgColor: "#FED7AA", // orange-200
    icon: "⭕",
  },
  {
    id: 4,
    name: "Grade 4",
    character: "Dottie the Decimal",
    color: "#3B82F6", // blue-500
    bgColor: "#BFDBFE", // blue-200
    icon: "🔵",
  },
  {
    id: 5,
    name: "Grade 5",
    character: "Max the Matrix",
    color: "#A855F7", // purple-500
    bgColor: "#E9D5FF", // purple-200
    icon: "⊞",
  },
];

export default function GradeSelectScreen() {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleGradeSelect = (gradeId: number) => {
    setSelectedGrade(gradeId);

    // Animation effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = async () => {
    if (selectedGrade) {
      try {
        // Check if user is already logged in
        const authToken = await AsyncStorage.getItem("authToken");
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          "hasCompletedOnboarding",
        );

        if (authToken && hasCompletedOnboarding === "true") {
          // User is logged in, update grade via API
          try {
            await apiService.updateGrade(selectedGrade);
            Alert.alert(
              "Đã cập nhật! ✅",
              `Bạn đã chuyển sang lớp ${selectedGrade}`,
              [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ],
            );
          } catch (error) {
            // If API fails, still save locally
            await AsyncStorage.setItem(
              "selectedGrade",
              selectedGrade.toString(),
            );
            console.error("Error updating grade via API:", error);
            router.back();
          }
        } else {
          // User is not logged in - redirect to login
          try {
            await AsyncStorage.setItem(
              "selectedGrade",
              selectedGrade.toString(),
            );

            // Navigate to login screen
            router.push("/login"); // Navigate to Login instead of creating guest
          } catch (error) {
            console.error("Error saving grade:", error);
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("Error saving grade:", error);
        Alert.alert("Lỗi", "Không thể lưu lớp học. Vui lòng thử lại.");
      }
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        {/* Header Navigation */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={handleBack}
            className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100"
          >
            <Feather name="chevron-left" color="#374151" size={24} />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View className="mb-8">
          <View className="bg-yellow-100 self-start px-4 py-2 rounded-full mb-4">
            <Text className="text-yellow-800 font-bold text-xs tracking-wider">
              LEVEL UP!
            </Text>
          </View>

          <Text className="text-3xl font-bold text-gray-900 mb-3">
            Which grade are you in?
          </Text>

          <Text className="text-gray-600 text-base leading-6">
            Pick your math level to start your adventure with our friends.
          </Text>
        </View>

        {/* Progress Indicator */}
        <View className="flex-row justify-center mb-8">
          <View className="w-8 h-1 bg-teal-500 rounded-full mx-1" />
          <View className="w-8 h-1 bg-gray-200 rounded-full mx-1" />
          <View className="w-8 h-1 bg-gray-200 rounded-full mx-1" />
          <View className="w-8 h-1 bg-gray-200 rounded-full mx-1" />
        </View>

        {/* Grade Options */}
        <View className="flex-row flex-wrap justify-between">
          {grades.map((grade) => {
            const isSelected = selectedGrade === grade.id;

            return (
              <TouchableOpacity
                key={grade.id}
                onPress={() => handleGradeSelect(grade.id)}
                activeOpacity={0.9}
                className={`w-[48%] mb-4 rounded-3xl p-6 relative ${
                  isSelected ? "border-4" : "border-2 border-transparent"
                }`}
                style={{
                  backgroundColor: grade.bgColor,
                  borderColor: isSelected ? grade.color : "transparent",
                }}
              >
                {/* Grade Number Badge */}
                <View className="absolute top-3 right-3 bg-white/50 w-8 h-8 rounded-full items-center justify-center">
                  <Text
                    className="text-sm font-bold"
                    style={{ color: grade.color }}
                  >
                    {grade.id}
                  </Text>
                </View>

                {/* Icon Container */}
                <View className="w-full aspect-square rounded-2xl items-center justify-center mb-4 bg-white/60">
                  <Text className="text-5xl">{grade.icon}</Text>
                </View>

                {/* Grade Name */}
                <Text className="text-lg font-bold text-gray-900 mb-1 text-center">
                  {grade.name}
                </Text>

                {/* Character Name */}
                <Text
                  className="text-xs font-medium text-center"
                  style={{ color: grade.color }}
                >
                  {grade.character}
                </Text>

                {/* Selected Badge */}
                {isSelected && (
                  <View
                    className="absolute -bottom-3 self-center px-3 py-1 rounded-full shadow-sm z-10"
                    style={{ backgroundColor: grade.color }}
                  >
                    <Text className="text-white text-[10px] font-bold uppercase">
                      Selected
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer Area */}
        <View className="mt-8 mb-8">
          <Text className="text-center text-gray-400 text-sm mb-6">
            You can always change this later in settings.
          </Text>

          <TouchableOpacity
            onPress={handleContinue}
            disabled={!selectedGrade}
            activeOpacity={0.8}
            className={`rounded-full py-4 flex-row items-center justify-center shadow-md ${
              selectedGrade ? "bg-teal-500" : "bg-gray-200"
            }`}
            style={{
              elevation: selectedGrade ? 4 : 0,
              shadowColor: selectedGrade ? "#14B8A6" : "transparent",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}
          >
            <Text className="text-center text-white text-lg font-bold mr-2">
              Let&apos;s Go!
            </Text>
            {selectedGrade && (
              <Ionicons name="rocket" color="white" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
