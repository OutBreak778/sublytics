import { BackButton } from "@/components/back-button";
import { useSignUp } from "@clerk/expo";
import { Image } from "expo-image";
import { Href, Link, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailValid =
    emailAddress.length === 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const passwordValid = password.length > 0;
  const formValid =
    emailAddress.length > 0 && password.length > 0 && emailValid;
  const userNameValid = username.length >= 3;

  const handleSubmit = async () => {
    if (
      !emailAddress ||
      !username ||
      !password ||
      !emailValid ||
      !userNameValid
    )
      return;

    try {
      const { error } = await signUp.password({
        emailAddress,
        username,
        password,
      });

      if (error) {
        console.error("Sign-up error:", JSON.stringify(error, null, 2));
        return;
      }

      await signUp.verifications.sendEmailCode();
    } catch (err: any) {
      console.error("Unexpected error during sign-up:", err);
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/(root)");
          if (url.startsWith("http")) {
            if (typeof window !== "undefined") {
              window.location.href = url;
            }
          } else {
            router.replace(url as Href);
          }
        },
      });
    } else {
      console.log("signup is not complete");
    }
  };

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address")
  ) {
    return (
      <SafeAreaView style={[styles.safeArea, { marginTop: insets.top }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.screen}
        >
          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Branding */}
              <BackButton />

              <View style={styles.brandBlock}>
                <View style={styles.logoWrap}>
                  <View style={styles.logoMark}>
                    <Image
                      source={require("@/assets/images/image.webp")}
                      style={[styles.logo]}
                      contentFit="contain"
                    />
                  </View>
                  <View>
                    <Text style={styles.wordmark}>Sublytics</Text>
                    <Text style={styles.wordmarkSub}>SUBSCRIPTIONS</Text>
                  </View>
                </View>
                <Text style={styles.title}>Verify your identity</Text>
                <Text style={styles.subtitle}>
                  We sent a verification code to your email
                </Text>
              </View>

              {/* Verification Form */}
              <View style={styles.card}>
                <View style={styles.form}>
                  <View style={styles.field}>
                    <Text style={styles.label}>Verification Code</Text>
                    <TextInput
                      style={styles.input}
                      value={code}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="rgba(0,0,0,0.4)"
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                    {errors?.fields?.code && (
                      <Text style={styles.error}>
                        {errors.fields.code.message}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    style={[
                      styles.button,
                      (!code || fetchStatus === "fetching") &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleVerify}
                    disabled={!code || fetchStatus === "fetching"}
                  >
                    <Text style={styles.buttonText}>
                      {fetchStatus === "fetching" ? "Verifying..." : "Verify"}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => signUp.verifications.sendEmailCode()}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text style={styles.secondaryButtonText}>Resend Code</Text>
                  </Pressable>

                  <Pressable
                    style={styles.secondaryButton}
                    onPress={() => signUp.reset()}
                    disabled={fetchStatus === "fetching"}
                  >
                    <Text style={styles.secondaryButtonText}>Start Over</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <BackButton />
            {/* Branding */}
            <View style={styles.brandBlock}>
              <View style={styles.logoWrap}>
                <Image
                  source={require("@/assets/images/image.webp")}
                  style={[styles.logo]}
                  resizeMode="contain"
                />
                <View>
                  <Text style={styles.wordmark}>Sublytics</Text>
                  <Text style={styles.wordmarkSub}>SUBSCRIPTIONS</Text>
                </View>
              </View>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            {/* Sign-In Form */}
            <View style={styles.card}>
              <View style={styles.form}>
                <View style={styles.field}>
                  <Text style={styles.label}>User Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      emailTouched && !emailValid && styles.inputError,
                    ]}
                    autoCapitalize="none"
                    value={username}
                    placeholder="Jhon Doe"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    onChangeText={setUsername}
                  />
                  {emailTouched && !emailValid && (
                    <Text style={styles.error}>
                      Please enter a valid email address
                    </Text>
                  )}
                  {errors?.fields?.emailAddress && (
                    <Text style={styles.error}>
                      {errors.fields.emailAddress.message}
                    </Text>
                  )}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={[
                      styles.input,
                      emailTouched && !emailValid && styles.inputError,
                    ]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="name@example.com"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    onChangeText={setEmailAddress}
                    onBlur={() => setEmailTouched(true)}
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                  {emailTouched && !emailValid && (
                    <Text style={styles.error}>
                      Please enter a valid email address
                    </Text>
                  )}
                  {errors?.fields?.emailAddress && (
                    <Text style={styles.error}>
                      {errors.fields.emailAddress.message}
                    </Text>
                  )}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[
                      styles.input,
                      passwordTouched && !passwordValid && styles.inputError,
                    ]}
                    value={password}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0,0,0,0.4)"
                    secureTextEntry
                    onChangeText={setPassword}
                    onBlur={() => setPasswordTouched(true)}
                    autoComplete="password"
                  />
                  {passwordTouched && !passwordValid && (
                    <Text style={styles.error}>Password is required</Text>
                  )}
                  {errors?.fields?.password && (
                    <Text style={styles.error}>
                      {errors.fields.password.message}
                    </Text>
                  )}
                </View>

                <Pressable
                  style={[
                    styles.button,
                    (!formValid || fetchStatus === "fetching") &&
                      styles.buttonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={!formValid || fetchStatus === "fetching"}
                >
                  <Text style={styles.buttonText}>
                    {fetchStatus === "fetching" ? "SignUpg In..." : "Sign In"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign-Up Link */}
            <View style={styles.linkRow}>
              <Text style={styles.linkCopy}>Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text style={styles.link}>Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 24,
  },

  // Branding
  brandBlock: {
    gap: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoMarkText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  wordmark: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1c1c1c",
    letterSpacing: -0.3,
  },
  wordmarkSub: {
    fontSize: 10,
    fontWeight: "500",
    color: "#888",
    letterSpacing: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1c1c1c",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },

  // Card
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  form: {
    gap: 16,
  },

  // Fields
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    letterSpacing: 0.1,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1c1c1c",
  },
  inputError: {
    borderColor: "#e53935",
  },
  error: {
    fontSize: 12,
    color: "#e53935",
    marginTop: 2,
  },

  // Primary button
  button: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1c1c1c",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // Secondary button
  secondaryButton: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#444",
    fontSize: 14,
    fontWeight: "500",
  },

  // Footer link
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  linkCopy: {
    fontSize: 14,
    color: "#888",
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1c1c1c",
  },

  logo: {
    width: 50,
    height: 50,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    borderRadius: 12,
  },
});

export default SignUp;
