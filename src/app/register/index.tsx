// 회원가입 / 로그인 창

import AccessButton from "@/components/register/AccessButton";
import { LinearGradient } from "expo-linear-gradient";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";

const Index = () => {
  const handleAuth = (url: string) => {
    const oauth_url = `http://localhost:8081/auth/${url}`;
    if (Platform.OS === "web") {
      window.location.href = oauth_url;
    } else {
      Linking.openURL(oauth_url);
    }
  };
  return (
    <View style={styles.phone}>
      <View style={styles.topContent}>
        <LinearGradient
          colors={["#3A3A3A", "#1C1C1C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoWrap}
        >
          <View></View>
        </LinearGradient>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>공유한 영상을 전부 한곳에</Text>
        </View>
        <View style={styles.noteWrap}>
          <Text style={styles.note}>
            SNS에서 공유 버튼만 누르면 원본 화질로 저장되고, 태그까지 자동으로
            정리돼요.
          </Text>
        </View>
      </View>
      <View style={styles.bottonContent}>
        <AccessButton
          backgroundColor="#f2f2f2"
          text="Apple로 계속하기"
          textColor="#121212"
          onPress={() => handleAuth("apple")}
          textStyle={{ ...BASE, fontSize: 15.5, fontWeight: 700 }}
          disabled={false}
        />
        <AccessButton
          backgroundColor="#1a1a1a"
          text="Google로 계속하기"
          textStyle={{ ...BASE, fontSize: 15.5, fontWeight: 600 }}
          textColor="#f2f2f2"
          onPress={() => handleAuth("google")}
          disabled={false}
        />
        <AccessButton
          text="이메일로 계속하기"
          textStyle={{ ...BASE, fontSize: 14.5, fontWeight: 500 }}
          textColor="#898989"
          onPress={() => handleAuth("email")}
          disabled={false}
        />
        <View style={styles.bottomNoteWrap}>
          <Text style={styles.bottomNote}>
            계속하면 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
          </Text>
        </View>
      </View>
    </View>
  );
};
const BASE = {
  fontFamily: "Pretendard",
  fontStyle: "normal",
} as const;

const styles = StyleSheet.create({
  phone: {
    width: 402,
    height: 874,
    backgroundColor: "#000000",
    borderRadius: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    marginLeft: 10,
    paddingInline: 24,
    paddingBottom: 34,
  },
  topContent: {
    display: "flex",
    paddingBottom: 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 15,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    alignSelf: "stretch",
  },
  logoWrap: {
    display: "flex",
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: 15,
  },
  titleWrap: {
    display: "flex",
    width: 163,
    paddingBottom: 12,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    ...BASE,
    color: "#f2f2f2",
    fontSize: 31,
    fontWeight: 700,
    lineHeight: 38.44,
    letterSpacing: -0.93,
  },
  noteWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  note: {
    ...BASE,
    color: "#757575",
    fontSize: 14.5,
    fontWeight: 400,
    lineHeight: 23.2,
  },
  bottonContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 15,
    alignSelf: "stretch",
  },
  bottomNoteWrap: {
    display: "flex",
    paddingTop: 2,
    paddingInline: 12,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
  },
  bottomNote: {
    ...BASE,
    color: "#4f4f4f",
    fontSize: 11.5,
    textAlign: "center",
    fontWeight: 400,
    lineHeight: 18.4,
  },
});

export default Index;
