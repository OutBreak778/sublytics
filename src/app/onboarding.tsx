import { AnalyticsEvents, useAnalytics } from "@/utils/analytics";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Onboarding = () => {
  const insets = useSafeAreaInsets();
  const { isSignedIn } = useAuth();
  const { track, trackScreen, identifyUser } = useAnalytics();

  // Screen View Tracking + Redirect if already signed in
  useEffect(() => {
    // Track screen view when onboarding loads
    trackScreen("Onboarding");

    const init = () => {
      if (isSignedIn) {
        track(AnalyticsEvents.ONBOARDING_SKIPPED, {
          reason: "already_signed_in",
          auto_redirect: true,
        });

        router.replace("/(root)");
      }
    };

    init();
  }, [isSignedIn, router, track, trackScreen]);

  const handleGetStarted = async () => {
    try {
      track(AnalyticsEvents.ONBOARDING_STARTED, {
        source: "onboarding_screen",
        button: "get_started",
      });

      router.navigate("/(auth)/sign-in");
    } catch (error) {
      console.error("Failed to navigate from onboarding:", error);

      track(AnalyticsEvents.ONBOARDING_STARTED, {
        source: "onboarding_screen",
        button: "get_started",
        success: false,
        error: "navigation_failed",
      });

      router.navigate("/");
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

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
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingBottom: 35,
  },
  bottomContainer: {
    flex: 1,
    gap: 18,
    marginTop: 40,
  },

  imageContainer: {
    alignItems: "center",
  },
  pattern: {
    width: "100%",
    height: 600,
  },

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

  buttonContainer: {
    marginTop: 12,
    paddingHorizontal: 2,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Onboarding;
