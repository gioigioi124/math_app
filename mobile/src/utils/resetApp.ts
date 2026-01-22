import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Reset app to initial state - useful for testing
 * Clears all AsyncStorage data
 */
export const resetApp = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log("✅ App reset successfully - all data cleared");
  } catch (error) {
    console.error("❌ Error resetting app:", error);
    throw error;
  }
};

/**
 * Clear only user/guest data, keep app settings
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      "authToken",
      "userId",
      "userType",
      "guestUserId",
      "deviceId",
      "hasCompletedOnboarding",
      "selectedGrade",
      "parentPhone",
      "childName",
    ]);
    console.log("✅ User data cleared");
  } catch (error) {
    console.error("❌ Error clearing user data:", error);
    throw error;
  }
};
