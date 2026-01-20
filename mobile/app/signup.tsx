import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen() {
  const [childName, setChildName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    // Validate inputs
    if (!childName.trim() || !parentEmail.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // TODO: Implement actual signup logic with backend
    // For now, just save locally and navigate
    try {
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      await AsyncStorage.setItem("childName", childName);
      await AsyncStorage.setItem("parentEmail", parentEmail);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#FFF9F0]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button */}
        <View className="pt-12 px-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-sm"
          >
            <Ionicons name="chevron-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View className="px-6 mt-4">
          <Text className="text-3xl font-bold text-gray-900 text-center">
            Join the Math Adventure!
          </Text>
        </View>

        {/* Mascot Image */}
        <View className="items-center mt-6 mb-4">
          <View className="bg-gradient-to-b from-sky-200 to-sky-100 rounded-3xl p-6 shadow-lg">
            <Image
              source={require("../assets/images/owl-mascot.png")}
              className="w-48 h-48"
              resizeMode="contain"
            />
          </View>
          {/* Decorative stars */}
          <View className="absolute top-0 left-8">
            <Text className="text-4xl">✨</Text>
          </View>
          <View className="absolute top-8 right-12">
            <Text className="text-3xl">⭐</Text>
          </View>
          <View className="absolute bottom-4 left-12">
            <Text className="text-2xl">✨</Text>
          </View>
          <View className="absolute bottom-0 right-8">
            <Text className="text-3xl">⭐</Text>
          </View>
        </View>

        {/* Subtitle */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Become a Math Hero
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            Perfect for grades 1-5. Let's start!
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 space-y-4">
          {/* Child's Name Input */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Child's Name
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="e.g., Alex"
                placeholderTextColor="#9CA3AF"
                value={childName}
                onChangeText={setChildName}
                className="flex-1 text-base text-gray-900"
                autoCapitalize="words"
              />
              <Ionicons name="happy-outline" size={24} color="#14B8A6" />
            </View>
          </View>

          {/* Parent's Email Input */}
          <View className="mt-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Parent's Email
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="For progress reports"
                placeholderTextColor="#9CA3AF"
                value={parentEmail}
                onChangeText={setParentEmail}
                className="flex-1 text-base text-gray-900"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons name="mail-outline" size={24} color="#14B8A6" />
            </View>
          </View>

          {/* Password Input */}
          <View className="mt-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Choose a Password
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="Make it strong!"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                className="flex-1 text-base text-gray-900"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#14B8A6"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Let's Go Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            className="bg-[#4ADE80] rounded-3xl py-5 mt-8 shadow-lg active:scale-95"
            style={{
              shadowColor: "#4ADE80",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-xl font-bold text-gray-900 mr-2">
                Let's Go!
              </Text>
              <Text className="text-2xl">🚀</Text>
            </View>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row items-center justify-center mt-6 mb-8">
            <Text className="text-base text-gray-600">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-base font-bold text-[#14B8A6]">Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
