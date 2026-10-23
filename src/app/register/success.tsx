import AccessButton from "@/components/register/AccessButton";
import Info from "@/components/register/Info";
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const exampleInfo = [
  { id: "nickname", title: "닉네임", text: "", plan: "" },
  { id: "plan", title: "플랜", text: "무료", plan: "Pro 보기" },
];

const Successs = () => {
  const handleToShare = () => {
    const url = "http://localhost:8081";
    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      Linking.openURL(url);
    }
  };

  const handleToStart = () => {
    const url = "http://localhost:8081";
    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      Linking.openURL(url);
    }
  };
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <View style={styles.topContent}>
          <View style={styles.successContainer}>
            <View style={styles.checkContainer}>
              <View style={styles.checkBackground}>
                <Image
                  source={require("@/assets/images/icons/check-icon-black.svg")}
                />
              </View>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>준비됐어요</Text>
              <Text style={styles.note}>
                이제 아무 앱에서든 영상을 공유해 보세요. 공유 시트에서 이 앱을
                고르면 바로 저장돼요.
              </Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            {exampleInfo.map((e) => (
              <Info key={e.id} title={e.title} text={e.text} plan={e.plan} />
            ))}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <AccessButton
              backgroundColor="#F2F2F2"
              text="시작하기"
              textColor="#121212"
              onPress={handleToStart}
            />
          </View>
          <View
            style={{
              height: 52,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={handleToShare}>
              <Text style={styles.shareNote}>공유 방법 먼저 볼게요</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  phone: {
    width: "100%",
    height: "100%",
    maxWidth: 402,
    maxHeight: 874,
    backgroundColor: "#000000",
    borderRadius: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  topContent: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 42,
  },
  buttonContainer: {
    width: "100%",
    height: 52,
    alignItems: "center",
  },
  shareNote: {
    fontFamily: "Pretendard",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 400,
    color: "#7D7D7D",
  },
  checkBackground: {
    width: 56,
    height: 56,
    backgroundColor: "#F2F2F2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: 28,
  },
  checkContainer: {
    width: "100%",
    maxWidth: 354,
    display: "flex",
    flexDirection: "column",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    fontFamily: "Pretendard",
    fontSize: 29,
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: 37.12,
    letterSpacing: -0.87,
    color: "#f2f2f2",
  },
  note: {
    fontFamily: "Pretendard",
    fontSize: 14.5,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: 23.2,
    color: "#757575",
  },
  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
    maxWidth: 354,
    gap: 26,
  },
  infoContainer: {
    width: "100%",
    maxWidth: 354,
    marginTop: 34,
  },
});

export default Successs;
