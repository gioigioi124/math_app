import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { AppText } from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

export const LessonDetailScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h1">Lesson Detail</AppText>
        <AppText variant="body" style={styles.text}>
          Lesson content will be displayed here
        </AppText>
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
  text: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});
