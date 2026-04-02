import { HOME_SUBSCRIPTIONS, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatDate } from "@/utils/format-date";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { UserAvatar } from "@/components/user-avatar";
import { colors } from "@/constants/theme";
import { AnalyticsEvents, useAnalytics } from "@/utils/analytics";
import { useUser } from "@clerk/expo";
import { FlashList } from "@shopify/flash-list";

const Index = () => {
  const insets = useSafeAreaInsets();
  const { user, isLoaded, isSignedIn } = useUser();
  const { track, trackScreen, identifyUser } = useAnalytics();

  // Track screen view & identify user when screen loads
  useEffect(() => {
    if (!isLoaded) return;

    trackScreen("Home"); // Main dashboard screen

    if (isSignedIn && user?.id) {
      identifyUser(user.id, {
        username: user.username,
        email: user.primaryEmailAddress?.emailAddress,
        full_name: user.fullName,
      });
    }
  }, [isLoaded, isSignedIn, user, trackScreen, identifyUser]);

  // Early returns
  if (!isLoaded) {
    return <Text style={{ padding: 20 }}>Loading dashboard...</Text>;
  }

  if (!isSignedIn || !user) {
    return <Text style={{ padding: 20 }}>No user is logged in</Text>;
  }

  // Handle "Add" button press
  const handleAddSubscription = () => {
    track(AnalyticsEvents.BUTTON_CLICKED, {
      button: "add_subscription",
      screen: "Home",
      location: "header",
    });

    // Future navigation: router.push('/add-subscription')
    // For now, just tracking
    console.log("Add subscription clicked");
  };

  // Handle "View All" in Upcoming section
  const handleViewAllUpcoming = () => {
    track(AnalyticsEvents.BUTTON_CLICKED, {
      button: "view_all_upcoming",
      screen: "Home",
    });
  };

  // Handle "View All" in All Subscriptions
  const handleViewAllSubscriptions = () => {
    track(AnalyticsEvents.BUTTON_CLICKED, {
      button: "view_all_subscriptions",
      screen: "Home",
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={[styles.topInsetBackground, { height: insets.top }]} />

      <FlashList
        ListHeaderComponent={
          <>
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.headerleft}>
                <UserAvatar size={48} />
                <Text style={styles.leftHeaderText}>
                  {user.username?.charAt(0).toUpperCase()}
                  {user.username?.slice(1)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.rightHeader}
                activeOpacity={0.7}
                onPress={handleAddSubscription}
              >
                <Image source={icons.add} style={styles.rightHeaderImage} />
              </TouchableOpacity>
            </View>

            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <View style={styles.balanceCardTop}>
                <Text style={styles.balanceCardText}>Balance</Text>
              </View>
              <View style={styles.balanceCardBottom}>
                <View style={styles.balanceCardBottomLeft}>
                  <Text style={styles.balanceCardBottomLeftText}>₹129.72</Text>
                </View>
                <View>
                  <Text style={styles.balanceCardBottomRightText}>05/26</Text>
                </View>
              </View>
            </View>

            {/* Upcoming Section Header */}
            <View style={styles.upcomingTop}>
              <View style={styles.upcomingTopLeft}>
                <Text style={styles.upcomingTopLeftText}>Upcoming</Text>
              </View>
              <TouchableOpacity
                style={styles.upcomingTopRight}
                onPress={handleViewAllUpcoming}
                activeOpacity={0.7}
              >
                <Text style={styles.upcomingTopRightText}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* Horizontal Upcoming List */}
            <View style={styles.upcomingBottom}>
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View key={item.id} style={styles.upcomingBottomCard}>
                    <View style={styles.upcomingBottomCardTop}>
                      <View style={styles.upcomingBottomCardTopLeft}>
                        <Image
                          source={item.icon}
                          style={styles.upcomingBottomCardTopLeftImage}
                        />
                      </View>
                      <View style={styles.upcomingBottomCardTopRight}>
                        <View style={styles.upcomingBottomCardTopRightTexts}>
                          <Text style={styles.upcomingBottomCardTopRightText1}>
                            ₹{item.price}
                          </Text>
                        </View>
                        <Text style={styles.upcomingBottomCardTopRightText2}>
                          {item.daysLeft} days left
                        </Text>
                      </View>
                    </View>
                    <View style={styles.upcomingBottomCardBottom}>
                      <Text style={styles.upcomingBottomCardBottomText}>
                        {item.name}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>

            <View style={styles.subscriptionTop}>
              <Text style={styles.subscriptionTopText}>All Subscriptions</Text>
              <TouchableOpacity
                style={styles.subscriptionTopRight}
                onPress={handleViewAllSubscriptions}
                activeOpacity={0.7}
              >
                <Text style={styles.subscriptionTopRightText}>View All</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={HOME_SUBSCRIPTIONS}
        renderItem={({ item }) => (
          <View
            key={item.id}
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
        )}
        keyExtractor={(item) => item.id}
        ListFooterComponent={<View style={{ height: insets.bottom + 10 }} />}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Changed from "#fff9e3"
    color: colors.foreground, // Changed from "#000"
  },
  topSection: {
    marginBottom: 12,
  },
  topInsetBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background, // Changed from "#fff9e3"
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    justifyContent: "space-between",
  },
  headerleft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  leftHeaderText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.foreground, // Changed from "#1a1a1a"
    letterSpacing: -0.3,
  },
  rightHeader: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border, // Changed from "#e0e0e0"
    borderRadius: 30,
    backgroundColor: colors.card, // Changed from "#ffffff"
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  rightHeaderImage: {
    height: 22,
    width: 22,
    tintColor: colors.mutedForeground, // Changed from "#666"
  },

  balanceCard: {
    height: 150,
    backgroundColor: colors.accent, // Changed from "#ea7a53"
    marginTop: 12,
    borderTopLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: colors.foreground,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  balanceCardTop: {
    marginLeft: 12,
    marginTop: 12,
    opacity: 0.9,
  },
  balanceCardText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    opacity: 0.95,
    fontFamily: "Inter_500Medium",
  },
  balanceCardBottom: {
    marginLeft: 12,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: 300,
    marginBottom: 8,
  },
  balanceCardBottomLeft: {
    flex: 1,
  },
  balanceCardBottomLeftText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  balanceCardBottomRightText: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.5,
    opacity: 0.9,
    includeFontPadding: false,
  },

  upcoming: {
    paddingVertical: 4,
    marginTop: 8,
  },
  upcomingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  upcomingTopLeft: {},
  upcomingTopLeftText: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.foreground, // Changed from "#1a1a1a"
    letterSpacing: -0.5,
    fontFamily: "Inter_700Bold",
  },
  upcomingTopRight: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border, // Changed from "#e0e0e0"
    borderRadius: 30,
  },
  upcomingTopRightText: {
    fontWeight: "500",
    fontSize: 13,
    color: colors.mutedForeground, // Changed from "#000"
    letterSpacing: 0.3,
    fontFamily: "Inter_500Medium",
  },
  upcomingBottom: {
    marginVertical: 20,
  },
  upcomingBottomCard: {
    borderWidth: 1.4,
    borderColor: colors.border, // Changed from "#99999970"
    backgroundColor: colors.card, // Changed from "#ffffff60"
    width: 170,
    height: 140,
    marginRight: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 20,
    shadowOpacity: 0.06,
    overflow: "hidden",
  },
  upcomingBottomCardTop: {
    paddingHorizontal: 15,
    paddingTop: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  upcomingBottomCardTopLeftImage: {
    width: 40,
    height: 40,
    tintColor: colors.accent, // Changed from "#ea7a53"
  },
  upcomingBottomCardTopLeft: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.muted, // Changed from "#fef5f0"
    width: 56,
    height: 56,
  },
  upcomingBottomCardTopRight: {
    marginLeft: 12,
    alignItems: "flex-start",
  },
  upcomingBottomCardTopRightTexts: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  upcomingBottomCardTopRightText1: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.foreground, // Changed from "#1a1a1a"
    letterSpacing: -0.5,
  },
  upcomingBottomCardTopRightText2: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.mutedForeground, // Changed from "#999"
    marginTop: 4,
    letterSpacing: -0.2,
  },
  upcomingBottomCardBottom: {
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  upcomingBottomCardBottomText: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.foreground, // Changed from "#333"
    letterSpacing: -0.3,
  },

  subscription: {
    marginTop: 8,
  },
  subscriptionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  subscriptionTopText: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.foreground, // Changed from "#1a1a1a"
    letterSpacing: -0.5,
    fontFamily: "Inter_700Bold",
  },
  subscriptionTopRight: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border, // Changed from "#e0e0e0"
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  subscriptionTopRightText: {
    fontWeight: "500",
    fontSize: 13,
    color: colors.mutedForeground, // Changed from "#555"
    letterSpacing: 0.3,
    fontFamily: "Inter_500Medium",
  },
  subscriptionBottom: {
    marginBottom: 40,
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
    color: colors.foreground, // Changed from "#000"
    letterSpacing: -0.3,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  subscriptionBottomCardLeftTextDate: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.mutedForeground, // Changed from "#00000090"
    letterSpacing: -0.2,
    fontFamily: "Inter_400Regular",
  },
  subscriptionBottomCardRight: {
    alignItems: "flex-end",
  },
  subscriptionBottomCardRightText1: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground, // Changed from "#000000"
    letterSpacing: -0.5,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  subscriptionBottomCardRightText2: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.mutedForeground, // Changed from "#00000090"
    letterSpacing: -0.2,
    fontFamily: "Inter_500Medium",
    textTransform: "capitalize",
  },
});

export default Index;
