import Ionicons from "@expo/vector-icons/Ionicons";
import { TabTriggerSlotProps } from "expo-router/ui";
import { ComponentProps, Ref } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconName = ComponentProps<typeof Ionicons>["name"];

type TabButtonProps = TabTriggerSlotProps & {
  icon: IconName;
  activeIcon: IconName;
  ref?: Ref<View>;
};

const TabButton = ({
  icon,
  activeIcon,
  children,
  isFocused,
  ...props
}: TabButtonProps) => {
  const color = isFocused ? "#f2f2f2" : "#666666";
  return (
    <Pressable {...props} style={styles.button}>
      <Ionicons name={isFocused ? activeIcon : icon} size={22} color={color} />
      <Text style={[styles.text, { color }]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
  },
  text: {
    fontFamily: "Pretendard",
    fontSize: 11,
    fontWeight: 500,
  },
});

export default TabButton;
