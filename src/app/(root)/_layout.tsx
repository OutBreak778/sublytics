import { tabs } from "@/constants/data";
import { Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, 12),
          height: 60,
          marginHorizontal: 15,
          borderRadius: 30,
          backgroundColor: "#1C1C1E",
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        },

        tabBarItemStyle: {
          paddingTop: 6,
        },

        tabBarIconStyle: {
          width: 128,
          height: 38,
        },
      }}
    >
      {tabs.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <View style={[styles.pill, focused && styles.pillActive]}>
                  <Image
                    source={item.icon}
                    style={[styles.glyph, focused && styles.glyphActive]}
                    resizeMode="contain"
                  />
                </View>
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    width: 75,
    height: 43,
    borderRadius: 999,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: {
    backgroundColor: "#555", // Change this to your active color
  },
  glyph: {
    width: 24,
    height: 24,
    tintColor: "#888",
  },
  glyphActive: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});
