import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "./UserProvider";

// Types
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  attempts: number;
  bestScore: number;
  completedAt?: string;
}

interface ProgressContextType {
  progressMap: Map<string, LessonProgress>;
  loading: boolean;
  getProgressForLesson: (lessonId: string) => LessonProgress | undefined;
  updateProgress: (
    lessonId: string,
    score: number,
    completed: boolean,
  ) => Promise<void>;
  getTotalCompleted: () => number;
  getTotalScore: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined,
);

const getProgressKey = (userId: string) => `@progress_${userId}`;

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  const [progressMap, setProgressMap] = useState<Map<string, LessonProgress>>(
    new Map(),
  );
  const [loading, setLoading] = useState(true);

  // Load progress when user changes
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setProgressMap(new Map());
        setLoading(false);
        return;
      }

      try {
        const savedProgress = await AsyncStorage.getItem(
          getProgressKey(user.id),
        );
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          setProgressMap(new Map(Object.entries(parsed)));
        } else {
          setProgressMap(new Map());
        }
      } catch (error) {
        console.error("Failed to load progress:", error);
        setProgressMap(new Map());
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user]);

  const getProgressForLesson = (
    lessonId: string,
  ): LessonProgress | undefined => {
    return progressMap.get(lessonId);
  };

  const updateProgress = async (
    lessonId: string,
    score: number,
    completed: boolean,
  ) => {
    if (!user) return;

    const existing = progressMap.get(lessonId);
    const newProgress: LessonProgress = {
      lessonId,
      completed: completed || existing?.completed || false,
      score,
      attempts: (existing?.attempts || 0) + 1,
      bestScore: Math.max(score, existing?.bestScore || 0),
      completedAt: completed ? new Date().toISOString() : existing?.completedAt,
    };

    const newMap = new Map(progressMap);
    newMap.set(lessonId, newProgress);
    setProgressMap(newMap);

    // Persist to storage
    const toSave = Object.fromEntries(newMap);
    await AsyncStorage.setItem(getProgressKey(user.id), JSON.stringify(toSave));
  };

  const getTotalCompleted = (): number => {
    let count = 0;
    progressMap.forEach((p) => {
      if (p.completed) count++;
    });
    return count;
  };

  const getTotalScore = (): number => {
    let total = 0;
    progressMap.forEach((p) => {
      total += p.bestScore;
    });
    return total;
  };

  return (
    <ProgressContext.Provider
      value={{
        progressMap,
        loading,
        getProgressForLesson,
        updateProgress,
        getTotalCompleted,
        getTotalScore,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
