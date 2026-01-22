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

export default function SignUpScreen() {
  const [childName, setChildName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validate inputs
    if (!childName.trim() || !parentPhone.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate phone number format (Vietnamese phone numbers)
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!phoneRegex.test(parentPhone.replace(/\s/g, ""))) {
      Alert.alert("Lỗi", "Số điện thoại không hợp lệ");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      // Check if there's a guest user to upgrade
      const deviceId = await AsyncStorage.getItem("deviceId");
      const guestUserId = await AsyncStorage.getItem("guestUserId");

      let response;

      if (deviceId && guestUserId) {
        // Upgrade existing guest to user
        response = await apiService.upgradeGuest({
          deviceId,
          childName: childName.trim(),
          phone: parentPhone.replace(/\s/g, ""),
          password,
        });

        console.log("Guest upgraded to user:", response);
      } else {
        // Normal registration (no guest user)
        const selectedGrade = await AsyncStorage.getItem("selectedGrade");
        response = await apiService.register({
          childName: childName.trim(),
          phone: parentPhone.replace(/\s/g, ""),
          password,
          grade: selectedGrade ? parseInt(selectedGrade) : 1,
        });

        console.log("New user registered:", response);
      }

      // Save user data locally
      await AsyncStorage.setItem("hasCompletedOnboarding", "true");
      await AsyncStorage.setItem("parentPhone", response.phone);
      await AsyncStorage.setItem("childName", response.childName);
      if (response.grade) {
        await AsyncStorage.setItem("selectedGrade", response.grade.toString());
      }

      // Show success message
      Alert.alert(
        "Đăng ký thành công! 🎉",
        `Chào mừng ${response.childName} đến với Math App!`,
        [
          {
            text: "Bắt đầu học",
            onPress: () => router.replace("/(tabs)"),
          },
        ],
      );
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert(
        "Đăng ký thất bại",
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
            Tham Gia Phiêu Lưu Toán Học!
          </Text>
        </View>

        {/* Mascot Image */}
        <View className="items-center mt-6 mb-4">
          <View className="bg-gradient-to-b from-sky-200 to-sky-100 rounded-3xl p-6 shadow-lg">
            <Image
              source={require("../../assets/images/owl-mascot.png")}
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
            Trở Thành Siêu Sao Toán Học
          </Text>
          <Text className="text-base text-gray-600 text-center mt-2">
            Hoàn hảo cho học sinh lớp 1-5. Bắt đầu nào!
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 space-y-4">
          {/* Child's Name Input */}
          <View>
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Tên Con
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="Ví dụ: Minh Anh"
                placeholderTextColor="#9CA3AF"
                value={childName}
                onChangeText={setChildName}
                className="flex-1 text-base text-gray-900"
                autoCapitalize="words"
              />
              <Ionicons name="happy-outline" size={24} color="#14B8A6" />
            </View>
          </View>

          {/* Parent's Phone Input */}
          <View className="mt-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">
              Số Điện Thoại Phụ Huynh
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="Để nhận báo cáo tiến độ"
                placeholderTextColor="#9CA3AF"
                value={parentPhone}
                onChangeText={setParentPhone}
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
              Chọn Mật Khẩu
            </Text>
            <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm border border-gray-100">
              <TextInput
                placeholder="Tối thiểu 6 ký tự"
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
            disabled={loading}
            className={`rounded-3xl py-5 mt-8 shadow-lg ${
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
                    Đang đăng ký...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-xl font-bold text-gray-900 mr-2">
                    Bắt Đầu Thôi!
                  </Text>
                  <Text className="text-2xl">🚀</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row items-center justify-center mt-6 mb-8">
            <Text className="text-base text-gray-600">Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-base font-bold text-[#14B8A6]">
                Đăng Nhập
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
