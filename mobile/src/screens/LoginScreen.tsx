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
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "../services/api.service";

import { useUser } from "../providers/UserProvider";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleLogin = async () => {
    // Validate inputs
    if (!phone.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate phone number format (Vietnamese phone numbers)
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ");
      return;
    }

    setLoading(true);

    try {
      // Call backend API
      const response = await apiService.login({
        phone: phone.replace(/\s/g, ""),
        password,
      });

      // Save user data locally
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      await AsyncStorage.setItem("parentPhone", response.phone);
      await AsyncStorage.setItem("childName", response.childName);
      if (response.grade) {
        await AsyncStorage.setItem("selectedGrade", response.grade.toString());
      }

      // Update User Provider
      await login({
        id: response._id,
        type: "user",
        grade: response.grade || 1,
        username: response.childName,
        email: response.phone,
        coins: response.coins || 0,
        xp: response.xp || 0,
        level: response.level || 1,
        avatar: response.avatar,
      });

      // Navigate to home
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Đăng nhập thất bại",
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
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
            Chào Mừng Trở Lại!
          </Text>
        </View>

        {/* Mascot Image */}
        <View className="items-center mt-8 mb-6">
          <View className="bg-gradient-to-b from-sky-200 to-sky-100 rounded-3xl p-8 shadow-lg">
            <Image
              source={require("../../assets/images/owl-mascot.png")}
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
            Tiếp Tục Hành Trình Toán Học
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            Đăng nhập để tiếp tục học tập!
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 space-y-4">
          {/* Phone Input */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Số Điện Thoại
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                className="flex-1 text-base text-gray-900"
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              <Ionicons name="call-outline" size={24} color="#14B8A6" />
            </View>
          </View>

          {/* Password Input */}
          <View className="mt-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Mật Khẩu
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="Nhập mật khẩu"
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
                Quên Mật Khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`rounded-3xl py-5 mt-6 shadow-lg ${
              loading ? "bg-gray-400" : "bg-[#4ADE80] active:scale-95"
            }`}
            style={{
              shadowColor: loading ? "#9CA3AF" : "#4ADE80",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <View className="flex-row items-center justify-center">
              {loading ? (
                <>
                  <ActivityIndicator size="small" color="#1F2937" />
                  <Text className="text-xl font-bold text-gray-900 ml-2">
                    Đang đăng nhập...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-xl font-bold text-gray-900 mr-2">
                    Đăng Nhập
                  </Text>
                  <Text className="text-2xl">🎯</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center mt-6 mb-8">
            <Text className="text-base text-gray-600">Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text className="text-base font-bold text-[#14B8A6]">
                Đăng Ký
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
