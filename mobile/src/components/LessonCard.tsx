import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ProgressBar } from "./ProgressBar";

interface LessonCardProps {
  title: string;
  icon: string; // emoji
  progress?: number; // 0 to 1
  completed?: boolean;
  locked?: boolean;
  xpReward?: number;
  onPress: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  title,
  icon,
  progress = 0,
  completed = false,
  locked = false,
  xpReward = 10,
  onPress,
}) => {
  const getCardStyle = () => {
    if (locked) return "bg-gray-200 opacity-60";
    if (completed) return "bg-green-100 border-2 border-green-400";
    return "bg-white border-2 border-purple-200";
  };

  return (
    <TouchableOpacity
      className={`rounded-2xl p-4 mb-3 shadow-sm ${getCardStyle()}`}
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        {/* Icon */}
        <View className="w-14 h-14 rounded-xl bg-purple-100 items-center justify-center mr-4">
          <Text className="text-3xl">{locked ? "🔒" : icon}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text
            className={`text-lg font-bold ${locked ? "text-gray-400" : "text-gray-800"}`}
          >
            {title}
          </Text>

          {!locked && (
            <View className="mt-2">
              <ProgressBar
                progress={progress}
                color={completed ? "green" : "purple"}
                height="sm"
              />
            </View>
          )}
        </View>

        {/* Status / Reward */}
        <View className="ml-2 items-center">
          {completed ? (
            <Text className="text-2xl">⭐</Text>
          ) : !locked ? (
            <View className="bg-yellow-100 px-2 py-1 rounded-lg">
              <Text className="text-xs font-bold text-yellow-600">
                +{xpReward} XP
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};
