export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  difficulty: "easy" | "medium" | "hard";
  content: string;
  xpReward: number;
  coinReward: number;
}

export interface Progress {
  _id: string;
  user: string;
  lesson: string;
  status: "locked" | "available" | "completed";
  score: number;
  completedAt?: Date;
}
