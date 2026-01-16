import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { borderRadius } from "../../constants/spacing";

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = colors.primary,
  backgroundColor = colors.border,
}) => {
  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: borderRadius.full,
  },
});
