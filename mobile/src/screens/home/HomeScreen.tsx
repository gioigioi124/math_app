import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { AppText } from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

export const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h1" style={styles.title}>
          Math Learning App
        </AppText>
        <AppText variant="body" style={styles.subtitle}>
          Welcome to your personalized math learning journey!
        </AppText>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <AppText variant="h2">0</AppText>
            <AppText variant="caption">Lessons Completed</AppText>
          </View>
          <View style={styles.statCard}>
            <AppText variant="h2">0</AppText>
            <AppText variant="caption">Total XP</AppText>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <AppText variant="h2">0</AppText>
            <AppText variant="caption">Coins</AppText>
          </View>
          <View style={styles.statCard}>
            <AppText variant="h2">1</AppText>
            <AppText variant="caption">Level</AppText>
          </View>
        </View>
      </View>
    </ScrollView>
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
  title: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  statsContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
});
