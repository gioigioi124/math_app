export type ActivityStatus =
  | "locked"
  | "not-started"
  | "in-progress"
  | "completed";

export interface Activity {
  id: string;
  title: string;
  status: ActivityStatus;
  icon: string;
  iconBg: string;
  color: string;
  description?: string;
  estimatedMinutes?: number;
  score?: number; // Score achieved (0-100)
  accuracy?: number; // Accuracy percentage (0-100)
}

export interface Lesson {
  id: string;
  number: string;
  title: string;
  icon: string;
  iconBg: string;
  progress: number; // 0-100
  unlocked: boolean;
  stars: number; // 0-3
  grade: string;
  totalActivities: number;
  activities: Activity[];
  description?: string;
  estimatedMinutes?: number;
  xpReward?: number;
  coinReward?: number;
}

export interface LessonCategory {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface LessonProgress {
  lessonId: string;
  progress: number;
  completed: number;
  lastActivityId?: string;
  updatedAt: string;
}

export interface ActivityProgress {
  activityId: string;
  lessonId: string;
  status: ActivityStatus;
  score?: number;
  accuracy?: number;
  completedAt?: string;
  attempts: number;
}
