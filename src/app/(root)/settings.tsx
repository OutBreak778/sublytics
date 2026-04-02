import { UserAvatar } from "@/components/user-avatar";
import { colors } from "@/constants/theme";
import { useClerk, useUser } from "@clerk/expo";
import React, { useEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Lucide React Native Icons
import { useAnalytics } from "@/utils/analytics";
import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Edit,
  Globe,
  Lock,
  LogOut,
  Mail,
  Moon,
  Receipt,
  User,
} from "lucide-react-native";

const Settings = () => {
  const insets = useSafeAreaInsets();
  const { track, trackScreen } = useAnalytics();

  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    trackScreen("Settings");
  }, []);

  const handleEditProfile = () => {
    track("button_clicked", { button: "edit_profile" });
    Alert.alert(
      "Edit Profile",
      "Profile editing screen coming soon.\n\nYou will be able to update your name, username, and profile picture.",
      [{ text: "Got it" }],
    );
  };

  const handleSignOut = () => {
    track("sign_out");
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
          router.replace("/onboarding");
        },
      },
    ]);
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Settings</Text>

        {/* Enhanced Profile Card with Accent */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <UserAvatar size={78} />

            <View style={styles.profileInfo}>
              <Text style={styles.userName}>
                {user?.fullName || user?.username || "User"}
              </Text>
              <Text style={styles.userEmail}>
                {user?.primaryEmailAddress?.emailAddress}
              </Text>
              {user?.username && (
                <Text style={styles.username}>@{user.username}</Text>
              )}
            </View>

            <Pressable style={styles.editButton} onPress={handleEditProfile}>
              <Edit size={22} color={colors.accent} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <SettingsItem
            icon={User}
            title="Edit Profile"
            subtitle="Update name, username & photo"
            onPress={handleEditProfile}
          />

          <SettingsItem
            icon={Mail}
            title="Email Addresses"
            subtitle="Manage your connected emails"
            onPress={() => Alert.alert("Coming Soon")}
          />

          <SettingsItem
            icon={Lock}
            title="Password & Security"
            subtitle="Change password, 2FA"
            onPress={() => Alert.alert("Coming Soon")}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <SettingsItem
            icon={Bell}
            title="Notifications"
            subtitle="Push notifications & alerts"
            onPress={() => Alert.alert("Coming Soon")}
          />

          <SettingsItem
            icon={Globe}
            title="Language"
            subtitle="English (United States)"
            onPress={() => Alert.alert("Coming Soon")}
          />

          <SettingsItem
            icon={Moon}
            title="Appearance"
            subtitle="Light Theme"
            onPress={() => Alert.alert("Coming Soon")}
          />
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>

          <SettingsItem
            icon={CreditCard}
            title="Manage Subscription"
            subtitle="Plan & Billing"
            color={colors.subscription}
            onPress={() => Alert.alert("Coming Soon")}
          />

          <SettingsItem
            icon={Receipt}
            title="Billing History"
            subtitle="View past payments"
            onPress={() => Alert.alert("Coming Soon")}
          />
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <SettingsItem
            icon={LogOut}
            title="Sign Out"
            subtitle="Logout from this device"
            color={colors.destructive}
            isDestructive
            onPress={handleSignOut}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Sublytics v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Reusable Settings Item
const SettingsItem = ({
  icon: Icon,
  title,
  subtitle,
  color = colors.foreground,
  isDestructive = false,
  onPress,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color?: string;
  isDestructive?: boolean;
  onPress: () => void;
}) => (
  <Pressable style={[styles.itemContainer]} onPress={onPress}>
    <View style={styles.itemLeft}>
      <Icon
        size={24}
        color={isDestructive ? colors.destructive : color}
        strokeWidth={2.2}
      />
      <View style={styles.itemText}>
        <Text
          style={[styles.itemTitle, isDestructive && styles.destructiveText]}
        >
          {title}
        </Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>
    </View>

    <ChevronRight size={20} color={colors.mutedForeground} strokeWidth={2.5} />
  </Pressable>
);

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
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.foreground,
    marginBottom: 24,
  },

  /* Profile Card - Enhanced with Accent */
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 18,
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.foreground,
  },
  userEmail: {
    fontSize: 15,
    color: colors.mutedForeground,
    marginTop: 3,
  },
  username: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: "500",
    marginTop: 2,
  },
  editButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(234, 122, 83, 0.1)", // Light accent background
  },

  /* Sections */
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.mutedForeground,
    marginBottom: 12,
    paddingLeft: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* Menu Item */
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemPressed: {
    opacity: 0.92,
  },
  itemLeft: {
    flexDirection: "row", // ← Fixed: Now properly row
    alignItems: "center",
    flex: 1,
  },
  itemText: {
    marginLeft: 16,
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: colors.foreground,
  },
  itemSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 3,
  },
  destructiveText: {
    color: colors.destructive,
  },

  /* Footer */
  footer: {
    alignItems: "center",
    marginTop: 30,
  },
  version: {
    fontSize: 13,
    color: colors.mutedForeground,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
});

export default Settings;
