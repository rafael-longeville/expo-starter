import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";

type TabRoutes = "home" | "checkout" | "settings" | "account";

export default function TabLayout() {
  const { isModalOpen } = useStayUpdatedModalContext();

  const TABS: Record<TabRoutes, { active?: any; inactive: any }> = {
    home: {
      active: require("../../assets/images/tabs/home-active.png"),
      inactive: require("../../assets/images/tabs/home.png"),
    },
    checkout: {
      inactive: require("../../assets/images/tabs/checkout.png"),
    },
    settings: {
      active: require("../../assets/images/tabs/settings-active.png"),
      inactive: require("../../assets/images/tabs/settings.png"),
    },
    account: {
      active: require("../../assets/images/tabs/account-active.png"),
      inactive: require("../../assets/images/tabs/account.png"),
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 30,
    },
    tabBar: {
      display: isModalOpen ? "none" : "flex",
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      height: 80,
      backgroundColor: "#DFE6FF",
      borderWidth: 1,
      borderTopWidth: 1,
      borderRadius: 30,
      borderColor: "#13293D",
      padding: 0,
      margin: 0,
      shadowColor: "transparent", // Remove shadow for iOS
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0, // Remove shadow for Android
    },
  });

  useEffect(() => {
    console.log("isModalOpen", isModalOpen);
  }, [isModalOpen]);

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false, // Hide labels
          tabBarStyle: styles.tabBar, // Apply custom tabBar style
          tabBarIcon: ({ focused }) => {
            const tabName = route.name as TabRoutes;
            return (
              <Image
                source={TABS[tabName]?.[focused ? "active" : "inactive"]}
                style={{
                  width:
                    route.name === "checkout"
                      ? 45
                      : route.name === "settings"
                        ? 37
                        : 35,
                  height:
                    route.name === "checkout"
                      ? 30
                      : route.name === "settings"
                        ? 36
                        : 35,
                  resizeMode: "contain",
                }}
              />
            );
          },
        })}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="checkout" />
        <Tabs.Screen name="settings" />
        <Tabs.Screen name="account" />
        <Tabs.Screen
          name="login"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 30,
  },
  tabBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 80,
    backgroundColor: "#DFE6FF",
    borderWidth: 1,
    borderTopWidth: 1,
    borderRadius: 30,
    borderColor: "#13293D",
    padding: 0,
    margin: 0,
    // shadowColor: "transparent", // Remove shadow for iOS
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0,
    // shadowRadius: 0,
    // elevation: 0, // Remove shadow for Android
  },
});
