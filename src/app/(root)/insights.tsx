import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { colors } from "@/constants/theme";
import { formatDate } from "@/utils/format-date";
import { Image } from "expo-image";
import { Ellipsis } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const weeklyExpenses: any[] = [
  { day: "Mon", amount: 90 },
  { day: "Tue", amount: 32 },
  { day: "Wed", amount: 68 },
  { day: "Thu", amount: 24 },
  { day: "Fri", amount: 89 },
  { day: "Sat", amount: 55 },
  { day: "Sun", amount: 42 },
];
const Insights = () => {
  const insets = useSafeAreaInsets();
  const [focusedBarIndex, setFocusedBarIndex] = useState<number | null>(null);

  const data = weeklyExpenses.map((item, index) => ({
    value: item.amount,
    frontColor: focusedBarIndex === index ? colors.foreground : colors.accent,
  }));

  const maxExpense = Math.max(
    ...weeklyExpenses.map((item) => item.amount),
    100,
  );

  const handleBarPress = (index: number) => {
    setFocusedBarIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topInsetBackground, { height: insets.top }]} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Insights</Text>
          <TouchableOpacity style={styles.headerRight} activeOpacity={0.7}>
            <Ellipsis size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingTop}>
          <View style={styles.upcomingTopLeft}>
            <Text style={styles.upcomingTopLeftText}>Upcoming</Text>
          </View>
          <TouchableOpacity style={styles.upcomingTopRight} activeOpacity={0.7}>
            <Text style={styles.upcomingTopRightText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chart}>
          <View style={styles.chartContainer}>
            <View style={styles.chartInner}>
              <BarChart
                data={data}
                barWidth={15}
                spacing={28}
                barBorderTopLeftRadius={12}
                barBorderTopRightRadius={12}
                barBorderBottomLeftRadius={12}
                barBorderBottomRightRadius={12}
                height={210}
                yAxisThickness={0}
                xAxisThickness={0}
                xAxisColor="transparent"
                yAxisColor="transparent"
                noOfSections={4}
                maxValue={maxExpense}
                stepValue={25}
                dashWidth={0}
                showLine={false}
                showValuesAsTopLabel={false}
                rulesType="solid"
                rulesColor={colors.border}
                rulesThickness={0.5}
                isAnimated={true}
                animationDuration={300}
                yAxisLabelPrefix="₹"
                yAxisTextStyle={styles.yAxisText}
                onPress={(item: any, index: number) => {
                  handleBarPress(index);
                }}
                focusBarOnPress={false}
                activeOpacity={1}
              />
            </View>
            <View style={styles.dayLabelsContainer}>
              {weeklyExpenses.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setFocusedBarIndex(index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayLabelText,
                      focusedBarIndex === index && styles.dayLabelTextActive,
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomSectionTop}>
          <View style={styles.bottomSectionTopLeft}>
            <Text style={styles.bottomSectionTopLeftText}>History</Text>
          </View>
          <TouchableOpacity
            style={styles.bottomSectionTopRight}
            activeOpacity={0.7}
          >
            <Text style={styles.bottomSectionTopRightText}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
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
          scrollEnabled={false}
          ListFooterComponent={
            <View style={{ height: 10, marginBottom: insets.bottom + 20 }} />
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topInsetBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 4,
  },
  headerRight: {
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 100,
  },
  chart: {
    marginBottom: 12,
  },
  chartContainer: {
    backgroundColor: colors.muted,
    height: 279,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chartInner: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -10,
  },
  yAxisText: {
    fontSize: 11,
    color: colors.mutedForeground,
    fontWeight: "500",
  },
  dayLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingLeft: 20,
    marginLeft: 24,
    marginTop: -5,
  },
  dayLabelText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mutedForeground,
    textAlign: "center",
    width: 32,
  },
  dayLabelTextActive: {
    color: colors.foreground,
    fontWeight: "700",
  },
  upcomingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  upcomingTopLeftText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  upcomingTopRight: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
  },
  upcomingTopRightText: {
    fontWeight: "500",
    fontSize: 13,
    color: colors.mutedForeground,
    letterSpacing: 0.3,
  },
  bottomSectionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  bottomSectionTopLeftText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  bottomSectionTopRight: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 30,
  },
  bottomSectionTopRightText: {
    fontWeight: "500",
    fontSize: 13,
    color: colors.mutedForeground,
    letterSpacing: 0.3,
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
    marginBottom: 4,
  },
  subscriptionBottomCardLeftTextDate: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.mutedForeground,
    letterSpacing: -0.2,
  },
  subscriptionBottomCardRight: {
    alignItems: "flex-end",
  },
  subscriptionBottomCardRightText1: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.foreground,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subscriptionBottomCardRightText2: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.mutedForeground,
    letterSpacing: -0.2,
    textTransform: "capitalize",
  },

  upcomingTopLeft: {
    flex: 1,
  },
  bottomSectionTopLeft: {
    flex: 1,
  },
});

export default Insights;
