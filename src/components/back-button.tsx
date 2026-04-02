import { Href, router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const BackButton = () => (
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => router.replace("/onboarding" as Href)}
    activeOpacity={0.7}
  >
    <ChevronLeft size={20} color="#1c1c1c" />
    <Text style={styles.backButtonText}>Back</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 2,
    marginBottom: 8,
  },
  backButtonText: { fontSize: 15, fontWeight: "500", color: "#1c1c1c" },
});
