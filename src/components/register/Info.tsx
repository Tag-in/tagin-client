import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface InfoProps {
  title: string;
  text: string;
  plan: string;
}

export default function Info({ title, text, plan }: InfoProps) {
  const handleToPro = () => {
    const url = "http://localhost:8081";

    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      Linking.openURL(url);
    }
  };
  return (
    <View
      style={[
        styles.infoContainer,
        plan ? { borderTopColor: "#202020", borderWidth: 1 } : undefined,
      ]}
    >
      <View style={{ width: 78 }}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text ? text : "설정 안 함"}</Text>
        {!plan ? undefined : (
          <TouchableOpacity onPress={handleToPro}>
            <Text style={styles.plan}>{plan}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const BASE = {
  fontFamily: "Pretendard",
  fontStyle: "normal",
} as const;

const styles = StyleSheet.create({
  infoContainer: {
    width: 354,
    height: 48,
    display: "flex",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  title: {
    ...BASE,
    fontSize: 13.5,
    fontWeight: 400,
    color: "#757575",
  },
  text: {
    ...BASE,
    fontSize: 14.5,
    fontWeight: 600,
    color: "#F2F2F2",
  },
  plan: {
    ...BASE,
    fontSize: 12.5,
    fontWeight: 400,
    color: "#E2BF76",
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    alignItems: "center",
  },
});
