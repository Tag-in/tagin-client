import TabButton from "@/components/TabButton";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TabLayout = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <Tabs style={styles.phone}>
        <View style={styles.slot}>
          <TabSlot />
        </View>
        <TabList style={styles.tabList}>
          <TabTrigger name="home" href="/home" asChild>
            <TabButton icon="home-outline" activeIcon="home">
            </TabButton>
          </TabTrigger>
          <TabTrigger name="tags" href="/tags" asChild>
            <TabButton icon="pricetag-outline" activeIcon="pricetag">
            </TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton icon="settings-outline" activeIcon="settings">
            </TabButton>
          </TabTrigger>
        </TabList>
      </Tabs>
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
    overflow: "hidden",
  },
  slot: {
    flex: 1,
  },
  tabList: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#202020",
    paddingBottom: 24,
  },
});

export default TabLayout;
