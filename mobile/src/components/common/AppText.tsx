import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

interface AppTextProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  color?: string;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = "body",
  color = colors.text,
  style,
  ...props
}) => {
  return <Text style={[styles[variant], { color }, style]} {...props} />;
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h3: {
    fontSize: 18,
    fontWeight: "600",
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
