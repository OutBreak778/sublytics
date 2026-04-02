import { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BubbleProps {
  side: "left" | "right" | "top" | "bottom";
  color: string;
  delay: number;
  baseSize: number; // initial size before growth
  startXPercent?: number; // horizontal start offset (0–1) - for left/right sides
  startYPercent?: number; // vertical start position (0–1) - for top/bottom sides
  wobbleAmplitude?: number; // optional: how much side-to-side sway
  blurRadius?: number; // optional: blur radius (0-20)
}

export const Bubble = ({
  side,
  color,
  delay,
  baseSize,
  startXPercent = 0.2,
  startYPercent = 0.3,
  wobbleAmplitude = 40,
  blurRadius = 0,
}: BubbleProps) => {
  const scale = useSharedValue(0.05);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const blurOpacity = useSharedValue(0);

  // Initialize starting positions based on side
  useEffect(() => {
    switch (side) {
      case "left":
        translateX.value = -SCREEN_WIDTH * startXPercent;
        translateY.value = SCREEN_HEIGHT * startYPercent - baseSize / 2;
        break;
      case "right":
        translateX.value = SCREEN_WIDTH * startXPercent;
        translateY.value = SCREEN_HEIGHT * startYPercent - baseSize / 2;
        break;
      case "top":
        translateX.value = SCREEN_WIDTH * (startXPercent || 0.5) - baseSize / 2;
        translateY.value = -SCREEN_HEIGHT * startYPercent;
        break;
      case "bottom":
        translateX.value = SCREEN_WIDTH * (startXPercent || 0.5) - baseSize / 2;
        translateY.value = SCREEN_HEIGHT * startYPercent;
        break;
    }
  }, []);

  useEffect(() => {
    // Growth sequence: slow start → fast cover
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.out(Easing.cubic) }),
        withTiming(4.2, { duration: 2200, easing: Easing.in(Easing.exp) }),
      ),
    );

    // Movement based on side
    switch (side) {
      case "left":
        translateX.value = withDelay(
          delay,
          withTiming(0, { duration: 3000, easing: Easing.out(Easing.quad) }),
        );
        break;
      case "right":
        translateX.value = withDelay(
          delay,
          withTiming(0, { duration: 3000, easing: Easing.out(Easing.quad) }),
        );
        break;
      case "top":
        translateY.value = withDelay(
          delay,
          withTiming(0, { duration: 3000, easing: Easing.out(Easing.quad) }),
        );
        break;
      case "bottom":
        translateY.value = withDelay(
          delay,
          withTiming(0, { duration: 3000, easing: Easing.out(Easing.quad) }),
        );
        break;
    }

    // Gentle wobble (movement while growing)
    if (side === "left" || side === "right") {
      translateY.value = withDelay(
        delay,
        withRepeat(
          withTiming(wobbleAmplitude, {
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        ),
      );
    } else {
      translateX.value = withDelay(
        delay,
        withRepeat(
          withTiming(wobbleAmplitude, {
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        ),
      );
    }

    // Subtle rotation for organic feel
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false,
      ),
    );

    // Blur animation if enabled
    if (blurRadius > 0) {
      blurOpacity.value = withDelay(
        delay + 1000,
        withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) }),
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: interpolate(scale.value, [0.05, 1, 4.2], [0.2, 0.65, 0.95]),
  }));

  const blurAnimatedStyle = useAnimatedStyle(() => {
    // Animate blur radius from 0 to specified value
    const currentBlur = blurRadius * blurOpacity.value;

    return {
      // Use shadow properties to simulate blur
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: blurOpacity.value * 0.3,
      shadowRadius: currentBlur,
      // For more blur effect, we can use multiple shadows
    };
  });

  // Get position styles based on side
  const getPositionStyles = () => {
    switch (side) {
      case "left":
        return {
          left: startXPercent * SCREEN_WIDTH,
          top: startYPercent * SCREEN_HEIGHT,
        };
      case "right":
        return {
          right: startXPercent * SCREEN_WIDTH,
          top: startYPercent * SCREEN_HEIGHT,
        };
      case "top":
        return {
          left: (startXPercent || 0.5) * SCREEN_WIDTH,
          top: startYPercent * SCREEN_HEIGHT,
        };
      case "bottom":
        return {
          left: (startXPercent || 0.5) * SCREEN_WIDTH,
          bottom: startYPercent * SCREEN_HEIGHT,
        };
    }
  };

  // Create layered bubbles for blur effect
  const renderBubbleLayers = () => {
    const layers = [];
    const numLayers =
      blurRadius > 0 ? Math.min(Math.ceil(blurRadius / 3), 5) : 1;

    for (let i = 0; i < numLayers; i++) {
      const layerScale = 1 + i * 0.1;
      const layerOpacity = 0.3 / (i + 1);
      const layerBlur = blurRadius * (i / numLayers);

      layers.push(
        <Animated.View
          key={i}
          style={[
            styles.bubble,
            animatedStyle,
            getPositionStyles(),
            {
              width: baseSize,
              height: baseSize,
              borderRadius: baseSize / 2,
              backgroundColor: color,
              transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value * layerScale },
                { rotate: `${rotation.value}deg` },
              ],
              opacity: interpolate(
                scale.value,
                [0.05, 1, 4.2],
                [0.05 * layerOpacity, 0.3 * layerOpacity, 0.5 * layerOpacity],
              ),
              // Simulate blur with multiple shadow layers
              shadowColor: color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: layerOpacity * 0.4,
              shadowRadius: layerBlur,
            },
          ]}
        />,
      );
    }

    // Main bubble (on top)
    layers.push(
      <Animated.View
        key="main"
        style={[
          styles.bubble,
          animatedStyle,
          getPositionStyles(),
          {
            width: baseSize,
            height: baseSize,
            borderRadius: baseSize / 2,
            backgroundColor: color,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 15,
          },
        ]}
      />,
    );

    return layers;
  };

  // Simple blur effect using overlay with opacity
  return (
    <>
      {blurRadius > 0 ? (
        // Blur effect using multiple layers
        <>
          {/* Background blur layers */}
          {renderBubbleLayers()}

          {/* Additional glow effect for stronger blur */}
          <Animated.View
            style={[
              styles.bubble,
              animatedStyle,
              getPositionStyles(),
              blurAnimatedStyle,
              {
                width: baseSize * 1.5,
                height: baseSize * 1.5,
                borderRadius: baseSize * 0.75,
                backgroundColor: "transparent",
                borderWidth: 2,
                borderColor: color + "40",
                transform: [
                  { translateX: translateX.value },
                  { translateY: translateY.value },
                  { scale: scale.value * 1.1 },
                  { rotate: `${rotation.value}deg` },
                ],
                opacity: blurOpacity.value * 0.2,
              },
            ]}
          />
        </>
      ) : (
        // No blur - simple bubble
        <Animated.View
          style={[
            styles.bubble,
            animatedStyle,
            getPositionStyles(),
            {
              width: baseSize,
              height: baseSize,
              borderRadius: baseSize / 2,
              backgroundColor: color,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 15,
            },
          ]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
  },
});
