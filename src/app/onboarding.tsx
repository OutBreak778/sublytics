import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Onboarding = () => {
  const insets = useSafeAreaInsets();

  const handleGetStarted = async () => {
    try {
      router.replace("/");
    } catch (error) {
      console.error("Failed to save onboarding status", error);
      router.replace("/"); // still navigate even if storage fails
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/splash-pattern.png")}
            style={styles.pattern}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Gain Financial Clarity</Text>
            <Text style={styles.description}>
              Track, Analyze and Cancel with ease.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ea7a53",
  },
  content: {
    flex: 1,
    justifyContent: "space-around", // This spreads image, text, and button
    paddingHorizontal: 12,
    paddingBottom: 35,
  },
  bottomContainer: {
    flex: 1,
    gap: 18,
    marginTop: 40,
  },

  // Image Section
  imageContainer: {
    alignItems: "center",
  },
  pattern: {
    width: "100%",
    height: 600, // Better controlled height
  },

  // Text Section
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "sans-extrabold",
  },
  description: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.95,
  },

  // Button Section
  buttonContainer: {
    marginTop: 12,
    paddingHorizontal: 2,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 30, // Nice border radius
    alignItems: "center",
  },
  buttonText: {
    color: "#000000", // Black text
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Onboarding;
