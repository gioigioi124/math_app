import React from "react";
import { View, Text } from "react-native";
import { LessonCard } from "./LessonCard";

interface Lesson {
  id: string;
  title: string;
  icon: string;
  progress?: number;
  completed?: boolean;
  locked?: boolean;
  xpReward?: number;
}

interface LessonGroupProps {
  title: string;
  lessons: Lesson[];
  onLessonPress: (lesson: Lesson) => void;
}

export const LessonGroup: React.FC<LessonGroupProps> = ({
  title,
  lessons,
  onLessonPress,
}) => {
  return (
    <View className="mb-6">
      {/* Group Header */}
      <View className="flex-row items-center mb-3">
        <View className="h-1 flex-1 bg-purple-200 rounded-full mr-3" />
        <Text className="text-lg font-bold text-purple-600">{title}</Text>
        <View className="h-1 flex-1 bg-purple-200 rounded-full ml-3" />
      </View>

      {/* Lessons */}
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          title={lesson.title}
          icon={lesson.icon}
          progress={lesson.progress}
          completed={lesson.completed}
          locked={lesson.locked}
          xpReward={lesson.xpReward}
          onPress={() => onLessonPress(lesson)}
        />
      ))}
    </View>
  );
};
