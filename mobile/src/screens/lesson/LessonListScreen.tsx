import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { AppText } from "../../components/common/AppText";
import { LessonCard } from "../../components/lesson/LessonCard";
import { lessonApi } from "../../services/lesson.api";
import { Lesson } from "../../types/lesson.type";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

export const LessonListScreen: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      const data = await lessonApi.getLessons();
      setLessons(data);
    } catch (error) {
      console.error("Failed to load lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <LessonCard
            lesson={item}
            onPress={() => console.log("Navigate to lesson:", item._id)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <AppText variant="body" style={styles.empty}>
            No lessons available yet
          </AppText>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: spacing.lg,
  },
  empty: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
});
