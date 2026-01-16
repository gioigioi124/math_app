import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../components/common/AppText";
import { AppButton } from "../../components/common/AppButton";
import { useAuthStore } from "../../store/auth.store";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

export const ProfileScreen: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h1">Profile</AppText>
        <AppText variant="body" style={styles.text}>
          Manage your account settings
        </AppText>

        <AppButton
          title="Logout"
          variant="outline"
          onPress={logout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  text: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginTop: spacing.xl,
  },
});
