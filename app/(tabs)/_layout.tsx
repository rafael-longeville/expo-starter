import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";
import CustomTabBar from "@/components/CustomTabBar";

type TabRoutes = "home" | "settings" | "account";

export default function TabLayout() {
  const { isModalOpen, isCheckoutModalOpen } = useStayUpdatedModalContext();

  const TABS: Record<TabRoutes, { active?: any; inactive: any }> = {
    home: {
      active: require("../../assets/images/tabs/home-active.png"),
      inactive: require("../../assets/images/tabs/home.png"),
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
      display: isCheckoutModalOpen || isModalOpen ? "none" : "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
    },
    checkoutButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 45,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    checkoutImage: {
      width: 45,
      height: 30,
      resizeMode: "contain",
    },
  });

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => {
            const tabName = route.name as TabRoutes;
            return (
              <Image
                source={TABS[tabName]?.[focused ? "active" : "inactive"]}
                style={{
                  width: route.name === "settings" ? 37 : 35,
                  height: route.name === "settings" ? 36 : 35,
                  resizeMode: "contain",
                }}
              />
            );
          },
          tabBarButton: (props) => {
            if (route.name === "checkout") {
              return null; // Hide default tab button for checkout
            }
            return <View {...props} />;
          },
        })}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="settings" />
        <Tabs.Screen name="login" options={{ href: null }} />
        {/* Custom Checkout Button */}
      </Tabs>
      {/* <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => setIsCheckoutModalOpen(true)}
      >
        <Image
          source={require("../../assets/images/tabs/checkout.png")}
          style={styles.checkoutImage}
        />
      </TouchableOpacity> */}
    </View>
  );
}
