import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function HomeScreen() {
  const handleReset = async () => {
    try {
      await AsyncStorage.multiRemove([
        "hasCompletedOnboarding",
        "selectedGrade",
      ]);
      router.replace("/grade-selection");
    } catch (e) {
      console.error("Error resetting onboarding:", e);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white gap-6">
      <Text className="text-2xl font-bold text-gray-900 font-bold">
        Welcome Home!
      </Text>

      <TouchableOpacity
        onPress={handleReset}
        className="bg-gray-100 px-6 py-3 rounded-full border border-gray-200 active:bg-gray-200"
      >
        <Text className="text-gray-700 font-medium">
          Reset & Go to Welcome Screen
        </Text>
      </TouchableOpacity>
    </View>
  );
}
