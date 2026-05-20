import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { premiumColors, zIndices } from "../theme/premiumTheme";

export default function Loader({ loading = false }) {
  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={premiumColors.primary} style={{ transform: [{ scale: 1.6 }] }} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(32,35,42,0.28)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: zIndices.modalOverlay,
    elevation: zIndices.modalOverlay,
    flex: 1,
  },
});
