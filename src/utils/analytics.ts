import { usePostHog } from "posthog-react-native";
import { useCallback } from "react";

export const AnalyticsEvents = {
  SIGN_UP_STARTED: "sign_up_started",
  SIGN_UP_COMPLETED: "sign_up_completed",
  SIGN_IN_STARTED: "sign_in_started",
  SIGN_IN_COMPLETED: "sign_in_completed",
  SIGN_OUT: "sign_out",

  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_COMPLETED: "onboarding_completed",
  ONBOARDING_SKIPPED: "onboarding_skipped",

  SUBSCRIPTION_ADDED: "subscription_added",
  SUBSCRIPTION_EDITED: "subscription_edited",
  SUBSCRIPTION_DELETED: "subscription_deleted",
  SUBSCRIPTION_VIEWED: "subscription_viewed",

  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_UPGRADED: "subscription_upgraded",
  SUBSCRIPTION_DOWNGRADED: "subscription_downgraded",
  SUBSCRIPTION_CANCELED: "subscription_canceled",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",

  SCREEN_VIEWED: "screen_viewed",
  BUTTON_CLICKED: "button_clicked",

  PROFILE_EDITED: "profile_edited",
  PROFILE_PICTURE_UPDATED: "profile_picture_updated",

  DASHBOARD_VIEWED: "dashboard_viewed",
  REPORT_GENERATED: "report_generated",
  EXPORT_PERFORMED: "export_performed",
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export const useAnalytics = () => {
  const posthog = usePostHog();

  const track = useCallback(
    (eventName: AnalyticsEvent, properties?: Record<string, any>) => {
      const eventProperties = {
        ...properties,
        timestamp: new Date().toISOString(),
        app_version: "1.0.0", // Update this dynamically later
        environment: __DEV__ ? "development" : "production",
      };

      // Debug log in development
      if (__DEV__) {
        console.log(`[PostHog] Event: ${eventName}`, eventProperties);
      }

      posthog?.capture(eventName, eventProperties);
    },
    [posthog],
  );

  // Helper for screen views (very useful with Expo Router)
  const trackScreen = useCallback(
    (screenName: string, additionalProps?: Record<string, any>) => {
      track(AnalyticsEvents.SCREEN_VIEWED, {
        screen: screenName,
        ...additionalProps,
      });
    },
    [track],
  );

  // Identify user (call this after successful sign in)
  const identifyUser = useCallback(
    (userId: string, userProperties?: Record<string, any>) => {
      if (!userId) return;

      posthog?.identify(userId, {
        ...userProperties,
        environment: __DEV__ ? "development" : "production",
      });

      if (__DEV__) {
        console.log(`[PostHog] User identified: ${userId}`, userProperties);
      }
    },
    [posthog],
  );

  return {
    track,
    trackScreen,
    identifyUser,
  };
};
