import { MORE_SUBSCRIPTIONS } from "@/constants/data";
import { colors } from "@/constants/theme";
import { formatDate } from "@/utils/format-date";
import { Image } from "expo-image";
import { Search } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Subscriptions = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'active', 'expiring'
  const [expanded, setExpanded] = useState(false);

  // Filter subscriptions based on search and filter type
  const getFilteredSubscriptions = () => {
    let filtered = MORE_SUBSCRIPTIONS;

    // Apply search filter
    if (search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Apply status filter
    if (filterType === "active") {
      filtered = filtered.filter((item) => {
        const startDate = new Date(item.startDate || "");
        const now = new Date();
        return startDate <= now;
      });
    } else if (filterType === "expiring") {
      filtered = filtered.filter((item) => {
        const startDate = new Date(item.startDate || "");
        const startDateTime = new Date(startDate).getTime();
        const diffTime = Math.abs(Date.now() - startDateTime);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Calculate days in billing cycle
        const daysInCycle = item.billing === "monthly" ? 30 : 365;
        const daysRemaining = daysInCycle - (diffDays % daysInCycle);

        return daysRemaining <= 5; // Expiring in next 5 days
      });
    }

    return filtered;
  };

  const filteredSubscriptions = getFilteredSubscriptions();

  const FilterChip = ({
    label,
    value,
    active,
  }: {
    label: String;
    value: any;
    active: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={() => setFilterType(value)}
      activeOpacity={0.7}
    >
      <Text
        style={[styles.filterChipText, active && styles.filterChipTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Text style={styles.emptyStateIconText}>📭</Text>
      </View>
      <Text style={styles.emptyStateTitle}>No subscriptions found</Text>
      <Text style={styles.emptyStateSubtitle}>
        {search
          ? "Try adjusting your search"
          : "Tap the + button to add your first subscription"}
      </Text>
    </View>
  );

  const SubscriptionStats = () => {
    const totalMonthly = MORE_SUBSCRIPTIONS.reduce((sum, item) => {
      if (item.billing === "monthly") return sum + item.price;
      return sum + item.price / 12;
    }, 0);

    const totalActive = MORE_SUBSCRIPTIONS.length;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{totalMonthly.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Monthly spend</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalActive}</Text>
          <Text style={styles.statLabel}>Active subs</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topInsetBackground, { height: insets.top }]} />

      <View style={[styles.content, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Subscriptions</Text>
            <Text style={styles.headerSubtitle}>
              Manage your recurring payments
            </Text>
          </View>
          {/* <TouchableOpacity
            style={styles.rightHeader}
            activeOpacity={0.7}
            // onPress={handleAddSubscription}
          >
            <Image source={icons.add} style={styles.rightHeaderImage} />
          </TouchableOpacity> */}
        </View>

        <SubscriptionStats />

        <View style={styles.searchContainer}>
          <Search size={20} color={colors.mutedForeground} />
          <TextInput
            style={styles.input}
            value={search}
            placeholder="Search subscriptions..."
            placeholderTextColor="rgba(0,0,0,0.4)"
            onChangeText={setSearch}
            keyboardType="default"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
          <FilterChip label="All" value="all" active={filterType === "all"} />
          <FilterChip
            label="Active"
            value="active"
            active={filterType === "active"}
          />
          <FilterChip
            label="Expiring soon"
            value="expiring"
            active={filterType === "expiring"}
          />
        </View>

        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setExpanded(true);
              }}
            >
              <View
                style={[
                  styles.subscriptionBottomCard,
                  { backgroundColor: item.color },
                ]}
              >
                <View style={styles.subscriptionBottomCardLeft}>
                  <View style={styles.subscriptionBottomCardLeftSide}>
                    <View
                      style={[
                        styles.subscriptionBottomCardLeftBox,
                        { backgroundColor: item.bgColor },
                      ]}
                    >
                      <Image
                        source={item.icon}
                        style={[styles.subscriptionBottomCardLeftIcon]}
                      />
                    </View>
                    <View style={styles.subscriptionBottomCardLeftText}>
                      <Text style={styles.subscriptionBottomCardLeftTextName}>
                        {item.name}
                      </Text>
                      <Text style={styles.subscriptionBottomCardLeftTextDate}>
                        Started {formatDate(item.startDate || "")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.subscriptionBottomCardRight}>
                    <Text style={styles.subscriptionBottomCardRightText1}>
                      ₹{item.price}
                    </Text>
                    <Text style={styles.subscriptionBottomCardRightText2}>
                      / {item.billing}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={EmptyState}
          ListFooterComponent={<View style={{ height: insets.bottom + 65 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            filteredSubscriptions.length === 0 && styles.emptyListContent
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff9e3",
    color: "#000",
  },
  topInsetBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff9e3",
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 4,
    marginTop: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 18,
    opacity: 0.7,
  },
  rightHeader: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
    backgroundColor: colors.card,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    marginTop: 4,
  },
  rightHeaderImage: {
    height: 22,
    width: 22,
    tintColor: colors.mutedForeground,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    opacity: 0.7,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    height: 45,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1c1c1c",
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.mutedForeground,
  },
  filterChipTextActive: {
    color: "#fff",
  },
  subscriptionBottomCard: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ffffff30",
    marginVertical: 8,
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  subscriptionBottomCardLeft: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  subscriptionBottomCardLeftSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subscriptionBottomCardLeftBox: {
    height: 56,
    width: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  subscriptionBottomCardLeftIcon: {
    width: 32,
    height: 32,
  },
  subscriptionBottomCardLeftText: {
    marginLeft: 14,
    flex: 1,
  },
  subscriptionBottomCardLeftTextName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: -0.3,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  subscriptionBottomCardLeftTextDate: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.mutedForeground,
    letterSpacing: -0.2,
    fontFamily: "Inter_400Regular",
  },
  subscriptionBottomCardRight: {
    alignItems: "flex-end",
  },
  subscriptionBottomCardRightText1: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: -0.5,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subscriptionBottomCardRightText2: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.mutedForeground,
    letterSpacing: -0.2,
    fontFamily: "Inter_500Medium",
    textTransform: "capitalize",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateIconText: {
    fontSize: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.foreground,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: "center",
    opacity: 0.7,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
export default Subscriptions;
