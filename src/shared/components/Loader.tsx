import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Loader({ loading = false }) {
  if (!loading) return null; // 👈 Don't show anything if loading = false

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#F08000"  style={{ transform: [{ scale: 1.6 }] }}/>
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
    backgroundColor: "rgba(0,0,0,0.3)", // optional dim background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    flex:1,
    // borderWidth:2,
    // borderColor:'red'
  },
});
