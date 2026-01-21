import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonClasses = () => {
    const base = "py-4 px-6 rounded-2xl items-center justify-center flex-row";
    if (disabled) return `${base} bg-gray-300`;
    switch (variant) {
      case "secondary":
        return `${base} bg-orange-400`;
      case "outline":
        return `${base} border-2 border-purple-500 bg-transparent`;
      default:
        return `${base} bg-purple-500`;
    }
  };

  const getTextClasses = () => {
    const base = "text-lg font-bold";
    if (variant === "outline") return `${base} text-purple-500`;
    return `${base} text-white`;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? "#8B5CF6" : "#FFFFFF"}
        />
      ) : (
        <Text className={getTextClasses()} style={textStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
