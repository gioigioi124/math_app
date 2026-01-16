import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import { spacing } from "../../constants/spacing";

export const ShopScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText variant="h1">Shop</AppText>
        <AppText variant="body" style={styles.text}>
          Purchase items with your coins!
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  text: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
});
