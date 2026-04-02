import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Insights = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* This View colors the area ABOVE the safe area (status bar / notch) */}
      <View style={[styles.topInsetBackground, { height: insets.top }]} />

      {/* Main content area - starts below the inset */}
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <Text style={styles.text}>Insights Page</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9e3", // fallback color for the rest of the screen
    color: "#000",
  },
  topInsetBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff9e3", // ← Change this to your desired color
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Insights;
