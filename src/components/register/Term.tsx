import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TermProps {
  isRequire: boolean;
  text: string;
  text_detail: string;
  isCheck: boolean;
  isDetail: boolean;
  onToggle: () => void;
  onDetailTextToggle: () => void;
}
const Term = ({
  isRequire,
  text,
  text_detail,
  isCheck,
  isDetail,
  onToggle,
  onDetailTextToggle,
}: TermProps) => {
  const rotation = useRef(new Animated.Value(isDetail ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isDetail ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isDetail, rotation]);

  const arrowRotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.termContainer,
          !isDetail
            ? {
                borderBottomColor: "#202020",
                borderBottomWidth: 1,
              }
            : undefined,
        ]}
      >
        <TouchableOpacity
          onPress={onDetailTextToggle}
          style={styles.touchable}
        >
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              <TouchableOpacity onPress={onToggle}>
                <View style={styles.arrowContainer}>
                  <Image
                    source={require("@/assets/images/icons/check-icon.svg")}
                    style={isCheck ? undefined : styles.unCheck}
                  />
                </View>
              </TouchableOpacity>
              <Text style={styles.textContainer}>
                <Text
                  style={[styles.require, !isRequire && styles.optionalOpacity]}
                >
                  {isRequire ? "필수 " : "선택 "}
                </Text>
                <Text style={styles.text}>{text}</Text>
              </Text>
            </View>
            <Animated.Image
              source={require("@/assets/images/icons/arrow-icon.svg")}
              style={[styles.arrow, { transform: [{ rotate: arrowRotate }] }]}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={isDetail ? styles.textDetailContainer : undefined}>
        <Text style={styles.textDetail}>{isDetail ? text_detail : null}</Text>
      </View>
    </View>
  );
};

const BASE = {
  fontFamily: "Pretendard",
  // fontSize: 12.5,
  lineHeight: 18,
  includeFontPadding: false,
  textAlignVertical: "center",
} as const;

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
  },
  root: {
    width: "100%",
    maxWidth: 354,
  },
  container: {
    display: "flex",
    width: "100%",
    maxWidth: 354,
    minHeight: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    fontStyle: "normal",
  },
  require: {
    ...BASE,
    color: "#FFFFFF",
    fontSize: 12.5,
    fontFamily: "Pretendard",
    fontWeight: 600,
    opacity: 0.55,
  },
  text: {
    ...BASE,
    color: "#FFFFFF",
    opacity: 0.82,
    fontSize: 14.5,
    fontWeight: 400,
  },
  textDetail: {
    ...BASE,
    color: "#949494",
    fontSize: 10,
    fontWeight: 500,
  },
  textDetailContainer: {
    width: "100%",
    maxWidth: 354,
    paddingInline: 18.5,
    paddingBottom: 16,
    borderBottomColor: "#202020",
    borderBottomWidth: 1,
  },
  unCheck: {
    opacity: 0.3,
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
  },
  arrow: {
    opacity: 0.28,
    flexShrink: 0,
  },
  leftContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  optionalOpacity: {
    opacity: 0.3,
  },
  arrowContainer: {
    display: "flex",
    width: 22,
    height: 22,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  termContainer: {
    display: "flex",
    width: "100%",
    maxWidth: 354,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
});

export default Term;
