import React from "react";
import { View, Text } from "react-native";

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: "purple" | "green" | "orange" | "blue";
  showLabel?: boolean;
  height?: "sm" | "md" | "lg";
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = "purple",
  showLabel = false,
  height = "md",
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);

  const getColorClass = () => {
    switch (color) {
      case "green":
        return "bg-green-500";
      case "orange":
        return "bg-orange-400";
      case "blue":
        return "bg-blue-500";
      default:
        return "bg-purple-500";
    }
  };

  const getHeightClass = () => {
    switch (height) {
      case "sm":
        return "h-2";
      case "lg":
        return "h-6";
      default:
        return "h-4";
    }
  };

  return (
    <View className="w-full">
      <View
        className={`w-full ${getHeightClass()} bg-gray-200 rounded-full overflow-hidden`}
      >
        <View
          className={`h-full ${getColorClass()} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </View>
      {showLabel && (
        <Text className="text-gray-600 text-sm mt-1 text-right">
          {percentage}%
        </Text>
      )}
    </View>
  );
};
