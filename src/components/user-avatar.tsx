// components/UserAvatar.tsx
import { useUser } from "@clerk/expo";
import { Image, StyleSheet, View } from "react-native";

type UserAvatarProps = {
  size?: number;
  borderColor?: string;
};

export const UserAvatar = ({ size = 48, borderColor }: UserAvatarProps) => {
  const { user } = useUser();

  const imageSize = size;
  const borderWidth = size > 40 ? 2 : 1.5;

  return user?.hasImage && user.imageUrl ? (
    <Image
      source={{ uri: user.imageUrl }}
      style={[
        styles.avatar,
        {
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
          borderWidth,
          borderColor: borderColor || "#e5e5e5",
        },
      ]}
      resizeMode="cover"
    />
  ) : (
    <View
      style={[
        styles.fallbackContainer,
        {
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2,
          borderWidth,
          borderColor: borderColor || "#e5e5e5",
        },
      ]}
    >
      <Image
        source={require("@/assets/images/people.png")}
        style={{
          width: size * 0.58,
          height: size * 0.58,
          tintColor: "#666",
        }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#f5f5f5",
  },
  fallbackContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
