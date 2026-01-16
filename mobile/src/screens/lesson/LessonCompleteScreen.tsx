import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../components/common/AppText";
import { AppButton } from "../../components/common/AppButton";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

export const LessonCompleteScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>
          🎉 Congratulations!
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          You've completed the lesson!
        </AppText>

        <View style={styles.rewards}>
          <AppText variant="h2">Rewards</AppText>
          <AppText variant="body">🪙 +10 Coins</AppText>
          <AppText variant="body">⭐ +50 XP</AppText>
        </View>

        <AppButton title="Continue" onPress={() => console.log("Continue")} />
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
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: spacing.xl,
    textAlign: "center",
    color: colors.textSecondary,
  },
  rewards: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.xl,
    width: "100%",
    alignItems: "center",
  },
});
