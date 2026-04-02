// src/components/SplashScreen.tsx
import { Bubble } from "@/components/bubble";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SplashScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const logoOpacity = useSharedValue(0);
  const nameOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Show logo + name with fade-in
    logoOpacity.value = withTiming(1, { duration: 800 });
    nameOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));

    // 2. Navigate after ~5 seconds
    const navigateTimer = setTimeout(() => {
      runOnJS(() => {
        // For Expo Router, you can also use: router.replace("/onboarding")
        navigation.replace("onboarding");
      })();
    }, 5000);

    return () => clearTimeout(navigateTimer);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Warm gradient background to match onboarding's orange vibe */}
      <LinearGradient
        colors={["#fff9e3", "#ffe8d1", "#ffccaa", "#ea7a53"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Soft warm bubbles using your color palette */}
      <Bubble
        side="left"
        color="rgba(255, 240, 220, 0.65)" // warm cream
        delay={1000}
        baseSize={SCREEN_WIDTH * 1.8}
        startXPercent={0.45}
        startYPercent={0.35}
        wobbleAmplitude={50}
      />
      <Bubble
        side="right"
        color="rgba(255, 200, 150, 0.55)" // soft peach
        delay={1200}
        baseSize={SCREEN_WIDTH * 1.8}
        startXPercent={0.5}
        startYPercent={0.55}
        wobbleAmplitude={35}
      />
      <Bubble
        side="left"
        color="rgba(255, 230, 200, 0.7)" // light apricot
        delay={1400}
        baseSize={SCREEN_WIDTH * 1.8}
        startXPercent={0.4}
        startYPercent={0.54}
        wobbleAmplitude={45}
      />

      {/* Centered Logo + Name */}
      <Animated.View style={styles.content}>
        <Animated.Image
          source={require("@/assets/images/image.webp")}
          style={[styles.logo, { opacity: logoOpacity }]}
          resizeMode="contain"
        />

        <Animated.Text style={[styles.appName, { opacity: nameOpacity }]}>
          Sublytics
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9e3", // fallback from your colors.background
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    borderRadius: 40,
  },
  appName: {
    fontSize: 68,
    fontWeight: "800",
    color: "#081126", // your colors.foreground / primary
    letterSpacing: -1.5,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
});

export default SplashScreen;
