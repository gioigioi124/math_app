import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TabParamList = {
  Home: undefined;
  Lessons: undefined;
  Leaderboard: undefined;
  Shop: undefined;
  Profile: undefined;
};

export type LessonStackParamList = {
  LessonList: undefined;
  LessonDetail: { lessonId: string };
  LessonComplete: { lessonId: string; score: number };
};
