import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Lesson } from "../../types/lesson.type";
import { AppText } from "../common/AppText";
import { ProgressBar } from "../common/ProgressBar";
import { colors } from "../../constants/colors";
import { spacing, borderRadius } from "../../constants/spacing";

interface LessonCardProps {
  lesson: Lesson;
  progress?: number;
  onPress: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  progress = 0,
  onPress,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return colors.success;
      case "medium":
        return colors.warning;
      case "hard":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <AppText variant="h3">{lesson.title}</AppText>
        <View
          style={[
            styles.badge,
            { backgroundColor: getDifficultyColor(lesson.difficulty) },
          ]}
        >
          <AppText style={styles.badgeText}>{lesson.difficulty}</AppText>
        </View>
      </View>

      {lesson.description && (
        <AppText variant="caption" style={styles.description}>
          {lesson.description}
        </AppText>
      )}

      <View style={styles.rewards}>
        <AppText variant="caption">🪙 {lesson.coinReward} coins</AppText>
        <AppText variant="caption">⭐ {lesson.xpReward} XP</AppText>
      </View>

      {progress > 0 && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} />
          <AppText variant="caption" style={styles.progressText}>
            {progress}%
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  description: {
    marginBottom: spacing.sm,
  },
  rewards: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  progressContainer: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  progressText: {
    minWidth: 40,
    textAlign: "right",
  },
});
