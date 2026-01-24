import AsyncStorage from "@react-native-async-storage/async-storage";
import { LessonProgress, ActivityProgress } from "../types/lesson.types";

// Storage keys
const KEYS = {
  LESSON_PROGRESS: "lesson_progress",
  ACTIVITY_PROGRESS: "activity_progress",
  USER_STATS: "user_stats",
  // Đồng bộ với phần còn lại của app (Login/Signup/GradeSelect/api.service...)
  SELECTED_GRADE: "selectedGrade",
};

// Backward-compat: key cũ từng dùng trong progress.service
const LEGACY_SELECTED_GRADE_KEY = "selected_grade";

// ==================== Lesson Progress ====================

export const saveLessonProgress = async (
  lessonId: string,
  progress: LessonProgress,
): Promise<void> => {
  try {
    const key = `${KEYS.LESSON_PROGRESS}_${lessonId}`;
    await AsyncStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving lesson progress:", error);
    throw error;
  }
};

export const getLessonProgress = async (
  lessonId: string,
): Promise<LessonProgress | null> => {
  try {
    const key = `${KEYS.LESSON_PROGRESS}_${lessonId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    return null;
  }
};

export const getAllLessonProgress = async (): Promise<
  Record<string, LessonProgress>
> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const lessonKeys = keys.filter((key) =>
      key.startsWith(KEYS.LESSON_PROGRESS),
    );

    const progressData: Record<string, LessonProgress> = {};

    for (const key of lessonKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const lessonId = key.replace(`${KEYS.LESSON_PROGRESS}_`, "");
        progressData[lessonId] = JSON.parse(data);
      }
    }

    return progressData;
  } catch (error) {
    console.error("Error getting all lesson progress:", error);
    return {};
  }
};

export const deleteLessonProgress = async (lessonId: string): Promise<void> => {
  try {
    const key = `${KEYS.LESSON_PROGRESS}_${lessonId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error deleting lesson progress:", error);
    throw error;
  }
};

// ==================== Activity Progress ====================

export const saveActivityProgress = async (
  lessonId: string,
  activityId: string,
  progress: ActivityProgress,
): Promise<void> => {
  try {
    const key = `${KEYS.ACTIVITY_PROGRESS}_${lessonId}_${activityId}`;
    await AsyncStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving activity progress:", error);
    throw error;
  }
};

export const getActivityProgress = async (
  lessonId: string,
  activityId: string,
): Promise<ActivityProgress | null> => {
  try {
    const key = `${KEYS.ACTIVITY_PROGRESS}_${lessonId}_${activityId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting activity progress:", error);
    return null;
  }
};

export const getLessonActivitiesProgress = async (
  lessonId: string,
): Promise<Record<string, ActivityProgress>> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const activityKeys = keys.filter(
      (key) =>
        key.startsWith(KEYS.ACTIVITY_PROGRESS) && key.includes(`_${lessonId}_`),
    );

    const progressData: Record<string, ActivityProgress> = {};

    for (const key of activityKeys) {
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const parts = key.split("_");
        const activityId = parts[parts.length - 1];
        progressData[activityId] = JSON.parse(data);
      }
    }

    return progressData;
  } catch (error) {
    console.error("Error getting lesson activities progress:", error);
    return {};
  }
};

export const deleteActivityProgress = async (
  lessonId: string,
  activityId: string,
): Promise<void> => {
  try {
    const key = `${KEYS.ACTIVITY_PROGRESS}_${lessonId}_${activityId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error deleting activity progress:", error);
    throw error;
  }
};

// ==================== User Stats ====================

export interface UserStats {
  totalLessonsStarted: number;
  totalLessonsCompleted: number;
  totalActivitiesCompleted: number;
  totalStarsEarned: number;
  totalTimeSpent: number; // in minutes
  lastActiveDate: string;
  streak: number; // consecutive days
  averageScore: number;
  totalScore: number;
  completionRate: number; // percentage
}

export const getUserStats = async (): Promise<UserStats | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_STATS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user stats:", error);
    return null;
  }
};

export const saveUserStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error("Error saving user stats:", error);
    throw error;
  }
};

export const updateUserStats = async (
  updates: Partial<UserStats>,
): Promise<void> => {
  try {
    const currentStats = await getUserStats();
    const newStats: UserStats = {
      totalLessonsStarted: 0,
      totalLessonsCompleted: 0,
      totalActivitiesCompleted: 0,
      totalStarsEarned: 0,
      totalTimeSpent: 0,
      lastActiveDate: new Date().toISOString(),
      streak: 0,
      averageScore: 0,
      totalScore: 0,
      completionRate: 0,
      ...currentStats,
      ...updates,
    };
    await saveUserStats(newStats);
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};

// ==================== Grade Selection ====================

export const getSelectedGrade = async (): Promise<number> => {
  try {
    // Ưu tiên key chuẩn hiện tại
    let grade = await AsyncStorage.getItem(KEYS.SELECTED_GRADE);

    // Fallback: nếu trước đây đã lưu theo key cũ, đọc và migrate
    if (!grade) {
      const legacy = await AsyncStorage.getItem(LEGACY_SELECTED_GRADE_KEY);
      if (legacy) {
        grade = legacy;
        await AsyncStorage.setItem(KEYS.SELECTED_GRADE, legacy);
        await AsyncStorage.removeItem(LEGACY_SELECTED_GRADE_KEY);
      }
    }

    return grade ? parseInt(grade) : 1;
  } catch (error) {
    console.error("Error getting selected grade:", error);
    return 1;
  }
};

export const saveSelectedGrade = async (grade: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SELECTED_GRADE, grade.toString());
    // Dọn key legacy nếu còn
    await AsyncStorage.removeItem(LEGACY_SELECTED_GRADE_KEY);
  } catch (error) {
    console.error("Error saving selected grade:", error);
    throw error;
  }
};

// ==================== Clear All Data ====================

export const clearAllProgress = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const progressKeys = keys.filter(
      (key) =>
        key.startsWith(KEYS.LESSON_PROGRESS) ||
        key.startsWith(KEYS.ACTIVITY_PROGRESS) ||
        key === KEYS.USER_STATS,
    );
    await AsyncStorage.multiRemove(progressKeys);
  } catch (error) {
    console.error("Error clearing all progress:", error);
    throw error;
  }
};

// ==================== Calculate Stats ====================

export const calculateUserStats = async (): Promise<UserStats> => {
  try {
    const allLessonProgress = await getAllLessonProgress();
    const lessonIds = Object.keys(allLessonProgress);

    let totalLessonsStarted = 0;
    let totalLessonsCompleted = 0;
    let totalActivitiesCompleted = 0;
    let totalStarsEarned = 0;
    let totalScore = 0;
    let scoreCount = 0;

    for (const lessonId of lessonIds) {
      const lessonProg = allLessonProgress[lessonId];
      if (lessonProg.progress > 0) {
        totalLessonsStarted++;
      }
      if (lessonProg.progress === 100) {
        totalLessonsCompleted++;
      }
      totalActivitiesCompleted += lessonProg.completed;

      // Get activities for this lesson
      const activities = await getLessonActivitiesProgress(lessonId);
      for (const activityId in activities) {
        const activity = activities[activityId];
        if (activity.score !== undefined) {
          totalScore += activity.score;
          scoreCount++;
        }
        if (activity.stars !== undefined) {
          totalStarsEarned += activity.stars;
        }
      }
    }

    const averageScore =
      scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    const completionRate =
      totalLessonsStarted > 0
        ? Math.round((totalLessonsCompleted / totalLessonsStarted) * 100)
        : 0;

    // Get current stats for streak and time
    const currentStats = await getUserStats();

    return {
      totalLessonsStarted,
      totalLessonsCompleted,
      totalActivitiesCompleted,
      totalStarsEarned,
      totalTimeSpent: currentStats?.totalTimeSpent || 0,
      lastActiveDate: new Date().toISOString(),
      streak: currentStats?.streak || 0,
      averageScore,
      totalScore,
      completionRate,
    };
  } catch (error) {
    console.error("Error calculating user stats:", error);
    return {
      totalLessonsStarted: 0,
      totalLessonsCompleted: 0,
      totalActivitiesCompleted: 0,
      totalStarsEarned: 0,
      totalTimeSpent: 0,
      lastActiveDate: new Date().toISOString(),
      streak: 0,
      averageScore: 0,
      totalScore: 0,
      completionRate: 0,
    };
  }
};
