import { StyleSheet, Text, View } from "react-native";

const Page = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>태그</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Pretendard",
    fontSize: 20,
    fontWeight: 700,
    color: "#f2f2f2",
  },
});

export default Page;
