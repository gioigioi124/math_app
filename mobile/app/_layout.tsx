import { Stack } from "expo-router";
import {
  useFonts,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { View, ActivityIndicator } from "react-native";
import "../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#14B8A6" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
