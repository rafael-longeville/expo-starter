import React from "react";
import { View, StyleSheet, Image, Pressable, Text } from "react-native";
import { Tabs } from "expo-router";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";

type TabRoutes = "home" | "settings" | "account";

export default function TabLayout() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 30,
    },
    tabBar: {
      bottom: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      marginHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 25,
      borderCurve: "continuous",
      shadowColor: "black",
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 10,
      shadowOpacity: 0.1,
    },
  });
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          // tabBarIcon: ({ focused }) => {
          //   const tabName = route.name as TabRoutes;
          //   return (
          //     <Image
          //       source={TABS[tabName]?.[focused ? "active" : "inactive"]}
          //       style={{
          //         width: route.name === "settings" ? 37 : 35,
          //         height: route.name === "settings" ? 36 : 35,
          //         resizeMode: "contain",
          //       }}
          //     />
          //   );
          // },
        })}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="settings" />
        <Tabs.Screen name="account" />
      </Tabs>
    </View>
  );
}

const TabBar = ({ state, descriptors, navigation }: any) => {
  const {
    isModalOpen,
    isCheckoutModalOpen,
    isValidationModalOpen,
    setIsCheckoutModalOpen,
  } = useStayUpdatedModalContext();

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
    tabBar: {
      display:
        isCheckoutModalOpen || isModalOpen || isValidationModalOpen
          ? "none"
          : "flex",
      position: "absolute",
      bottom: 25,
      left: 20,
      right: 20,
      paddingHorizontal: 20,
      height: 80,
      backgroundColor: "#DFE6FF",
      borderWidth: 1,
      borderRadius: 30,
      borderColor: "#13293D",
    },
    tabBarContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: "100%",
      width: "90%",
    },
    tabItem: {
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    checkoutButton: {
      width: 45,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },
    checkoutImage: {
      width: 45,
      height: 30,
      resizeMode: "contain",
    },
  });

  // Separate the first route and the last two routes
  const firstRoute = state.routes[0];
  const lastTwoRoutes = state.routes.slice(1);

  return (
    <View style={styles.tabBar}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <View style={styles.tabBarContainer}>
          {/* Render the first route */}
          <Pressable
            key={firstRoute.key}
            onPress={() => navigation.navigate(firstRoute.name)}
            style={styles.tabItem}
          >
            <Image
              source={
                state.index === 0
                  ? TABS[firstRoute.name as TabRoutes].active
                  : TABS[firstRoute.name as TabRoutes].inactive
              }
              style={{
                width: 35,
                height: 35,
                resizeMode: "contain",
              }}
            />
          </Pressable>

          {/* Render the checkout button */}
          <Pressable
            key="checkout"
            onPress={() => {
              navigation.navigate("home");
              setIsCheckoutModalOpen(true);
            }}
            style={styles.checkoutButton}
          >
            <Image
              source={require("../../assets/images/tabs/checkout.png")}
              style={styles.checkoutImage}
            />
          </Pressable>

          {/* Render the last two routes */}
          {lastTwoRoutes.map((route: any, index: number) => {
            const isFocused = state.index === index + 1; // Adjust index for last routes
            const tabName = route.name as TabRoutes;
            const icon = isFocused
              ? TABS[tabName].active
              : TABS[tabName].inactive;

            if (!route) return null; // Ensure the route is not undefined
            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={styles.tabItem}
              >
                <Image
                  source={icon}
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: "contain",
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
};
