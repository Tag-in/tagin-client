import AccessButton from "@/components/register/AccessButton";
import Term from "@/components/register/Term";
import { useState } from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Terms = () => {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [detail, setDetail] = useState<Record<string, boolean>>({});

  const ex = [
    {
      id: "age",
      isRequire: true,
      text: "만 14세 이상입니다",
      text_detail:
        "만 14세 이상 이용 약관 상세 내용 만 14세 이상 이용 약관 상세 내용 만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용만 14세 이상 이용 약관 상세 내용",
      isCheck: checks.age ?? false,
      isDetail: detail.age ?? false,
      onToggle: () => setChecks((prev) => ({ ...prev, age: !prev.age })),
      onDetailTextToggle: () =>
        setDetail((prev) => ({ ...prev, age: !prev.age })),
    },
    {
      id: "service",
      isRequire: true,
      text: "서비스 이용약관",
      text_detail:
        "서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용서비스 이용약관 상세 내용",
      isCheck: checks.service ?? false,
      isDetail: detail.service ?? false,
      onToggle: () =>
        setChecks((prev) => ({ ...prev, service: !prev.service })),
      onDetailTextToggle: () =>
        setDetail((prev) => ({ ...prev, service: !prev.service })),
    },
    {
      id: "privacy",
      isRequire: true,
      text: "개인정보 수집 및 이용",
      text_detail:
        "개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용개인정보 수집 및 이용 상세 내용",
      isCheck: checks.privacy ?? false,
      isDetail: detail.privacy ?? false,
      onToggle: () =>
        setChecks((prev) => ({ ...prev, privacy: !prev.privacy })),
      onDetailTextToggle: () =>
        setDetail((prev) => ({ ...prev, privacy: !prev.privacy })),
    },
    {
      id: "marketing",
      isRequire: false,
      text: "마케팅 정보 수신",
      text_detail:
        "마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용마케팅 정보 수신 동의 상세 내용",
      isCheck: checks.marketing ?? false,
      isDetail: detail.marketing ?? false,
      onToggle: () =>
        setChecks((prev) => ({ ...prev, marketing: !prev.marketing })),
      onDetailTextToggle: () =>
        setDetail((prev) => ({ ...prev, marketing: !prev.marketing })),
    },
  ];

  const checkAll = ex.every((item) => item.isCheck);
  const checkAllRequire = ex.every((item) => !item.isRequire || item.isCheck);
  const toggleSetCheckAll = () => {
    const next = !checkAll;
    const updatedChecks: Record<string, boolean> = {};
    ex.forEach((item) => {
      updatedChecks[item.id] = next;
    });
    setChecks(updatedChecks);
  };

  const access = () => {
    const url = "http://localhost:8081/register/success";
    if (Platform.OS === "web") {
      window.location.href = url;
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.phone}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>약관에 동의해 주세요</Text>
              <Text style={styles.titleNote}>
                필수 항목에 동의하면 바로 시작할 수 있어요.
              </Text>
            </View>
            <TouchableOpacity onPress={toggleSetCheckAll}>
              <View style={styles.checkAllContainer}>
                <View
                  style={[
                    styles.checkAllBox,
                    checkAll ? styles.check : styles.unCheck,
                  ]}
                >
                  <Image
                    source={require("@/assets/images/icons/check-icon.svg")}
                    style={checkAll ? undefined : styles.unCheck}
                  />
                </View>
                <Text style={styles.checkAllText}>전체 동의</Text>
              </View>
            </TouchableOpacity>
            {ex.map((e) => (
              <Term
                key={e.id}
                isRequire={e.isRequire}
                text={e.text}
                text_detail={e.text_detail}
                isCheck={e.isCheck}
                isDetail={e.isDetail}
                onToggle={e.onToggle}
                onDetailTextToggle={e.onDetailTextToggle}
              />
            ))}
            <View style={styles.noteContainer}>
              <Text style={styles.note}>
                만 14세 미만 보호자 동의가 필요합니다. 선택 항목에 동의하지
                않아도 서비스를 이용할 수 있어요.
              </Text>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <AccessButton
              backgroundColor={checkAllRequire ? "#F2F2F2" : "#1E1E1E"}
              text="동의하고 계속"
              textColor={checkAllRequire ? "#121212" : "#666666"}
              onPress={access}
              disabled={!checkAllRequire}
            />
          </View>
        </ScrollView>
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
    paddingTop: 100,
    width: "100%",
    height: "100%",
    maxWidth: 402,
    maxHeight: 874,
    backgroundColor: "#000000",
    borderRadius: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 32,
    overflow: "hidden",
  },
  scroll: {
    flex: 1,
    minHeight: 0,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topContent: {
    alignItems: "center",
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 42,
  },
  note: {
    fontFamily: "Pretendard",
    color: "#595959",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: 19.2,
  },
  noteContainer: {
    display: "flex",
    width: 354,
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 17.09,
    marginInline: 24,
  },
  checkAllBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#494949",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    borderColor: "#ffffff",
  },
  unCheck: {
    opacity: 0.4,
  },
  checkAllContainer: {
    width: 359,
    height: 54,
    backgroundColor: "#1A1A1A",
    display: "flex",
    flexDirection: "row",
    borderRadius: 13,
    alignItems: "center",
    marginBottom: 8,
    gap: 13,
    padding: 16,
  },
  checkAllText: {
    color: "rgba(242, 242, 242, 1)",
    fontFamily: "Pretendard",
    fontSize: 15.5,
    fontStyle: "normal",
    fontWeight: 600,
    letterSpacing: -0.155,
  },
  titleContainer: {
    width: 354,
    height: 64.8,
    display: "flex",
    flexDirection: "column",
    gap: 8.8,
    marginBottom: 30.68,
  },
  title: {
    fontFamily: "Pretendard",
    color: "#F2F2F2",
    fontSize: 26,
    fontWeight: 700,
    fontStyle: "normal",
    lineHeight: 33.8,
    letterSpacing: -0.65,
  },
  titleNote: {
    color: "#757575",
    fontFamily: "Pretendard",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: 21.7,
  },
});

export default Terms;
