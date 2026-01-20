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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // TODO: Implement actual login logic with backend
    // For now, just save locally and navigate
    try {
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      await AsyncStorage.setItem("parentEmail", email);
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
            Welcome Back!
          </Text>
        </View>

        {/* Mascot Image */}
        <View className="items-center mt-8 mb-6">
          <View className="bg-gradient-to-b from-sky-200 to-sky-100 rounded-3xl p-8 shadow-lg">
            <Image
              source={require("../assets/images/owl-mascot.png")}
              className="w-56 h-56"
              resizeMode="contain"
            />
          </View>
          {/* Decorative stars */}
          <View className="absolute top-4 left-12">
            <Text className="text-4xl">⭐</Text>
          </View>
          <View className="absolute top-12 right-16">
            <Text className="text-3xl">✨</Text>
          </View>
          <View className="absolute bottom-8 left-16">
            <Text className="text-2xl">⭐</Text>
          </View>
          <View className="absolute bottom-4 right-12">
            <Text className="text-3xl">✨</Text>
          </View>
        </View>

        {/* Subtitle */}
        <View className="px-6 mb-8">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Continue Your Math Journey
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            Log in to pick up where you left off!
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 space-y-4">
          {/* Email Input */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Parent's Email
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
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
              Password
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="Enter your password"
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

          {/* Forgot Password Link */}
          <View className="items-end mt-2">
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-[#14B8A6]">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-[#4ADE80] rounded-3xl py-5 mt-6 shadow-lg active:scale-95"
            style={{
              shadowColor: "#4ADE80",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-xl font-bold text-gray-900 mr-2">
                Log In
              </Text>
              <Text className="text-2xl">🎯</Text>
            </View>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center mt-6 mb-8">
            <Text className="text-base text-gray-600">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text className="text-base font-bold text-[#14B8A6]">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
