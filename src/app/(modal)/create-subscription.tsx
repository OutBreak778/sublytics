import { colors } from "@/constants/theme"; // ← Import your color palette
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddSubscription = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    name: "",
    plan: "",
    category: "",
    price: "",
    currency: "USD",
    billing: "Monthly",
    paymentMethod: "",
    startDate: "",
    renewalDate: "",
  });

  const handleSave = () => {
    if (!form.name || !form.plan || !form.price) {
      Alert.alert("Missing Fields", "Please fill Service Name, Plan and Price");
      return;
    }

    console.log("New Subscription:", form);

    Alert.alert("Success", "Subscription added successfully!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.topInsetBackground, { height: insets.top }]} />

        <View style={[{ paddingTop: insets.top }]}>
          {/* <BackButton /> */}
          <Text style={[styles.heading, { color: colors.foreground }]}>
            New Subscription
          </Text>

          {/* Service Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Service Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              placeholder="e.g. Adobe, Netflix, Spotify"
              placeholderTextColor={colors.mutedForeground}
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
          </View>

          {/* Plan */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Plan
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              placeholder="e.g. Pro, Premium"
              placeholderTextColor={colors.mutedForeground}
              value={form.plan}
              onChangeText={(text) => setForm({ ...form, plan: text })}
            />
          </View>

          {/* Category */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Category
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              placeholder="e.g. Creativity, Streaming"
              placeholderTextColor={colors.mutedForeground}
              value={form.category}
              onChangeText={(text) => setForm({ ...form, category: text })}
            />
          </View>

          {/* Price & Billing */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Price
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="₹318.75"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.mutedForeground}
                value={form.price}
                onChangeText={(text) => setForm({ ...form, price: text })}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Billing Cycle
              </Text>
              <View
                style={[
                  styles.billingOptions,
                  { backgroundColor: "#ffffff90" },
                ]}
              >
                {["Monthly", "Yearly"].map((cycle) => (
                  <TouchableOpacity
                    key={cycle}
                    style={[
                      styles.billingOption,
                      form.billing === cycle && {
                        backgroundColor: colors.accent,
                      },
                    ]}
                    onPress={() => setForm({ ...form, billing: cycle })}
                  >
                    <Text
                      style={[
                        styles.billingText,
                        { color: colors.mutedForeground },
                        form.billing === cycle && { color: "#fff" },
                      ]}
                    >
                      {cycle}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>
              Payment Method
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  color: colors.foreground,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Visa ending in 8530"
              placeholderTextColor={colors.mutedForeground}
              value={form.paymentMethod}
              onChangeText={(text) => setForm({ ...form, paymentMethod: text })}
            />
          </View>

          {/* Dates */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Start Date
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="2026-04-03"
                placeholderTextColor={colors.mutedForeground}
                value={form.startDate}
                onChangeText={(text) => setForm({ ...form, startDate: text })}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>
                Renewal Date
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="2026-05-03"
                placeholderTextColor={colors.mutedForeground}
                value={form.renewalDate}
                onChangeText={(text) => setForm({ ...form, renewalDate: text })}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.accent }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Add Subscription</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default AddSubscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topInsetBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff9e3",
    zIndex: 1,
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 16,
    marginTop: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "500",
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
  },
  billingOptions: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  billingText: {
    fontWeight: "600",
  },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "#fff", // White text on subscription color
    fontSize: 18,
    fontWeight: "bold",
  },
});
