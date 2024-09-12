import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Tabs } from "expo-router";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";
import CustomTabBar from "@/components/CustomTabBar";

type TabRoutes = "home" | "settings" | "account";

export default function TabLayout() {
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
  const { isModalOpen, isCheckoutModalOpen, setIsCheckoutModalOpen } =
    useStayUpdatedModalContext();

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
      display: isCheckoutModalOpen || isModalOpen ? "none" : "flex",
      position: "absolute",
      bottom: 25,
      left: 20,
      right: 20,
      paddingHorizontal: 20, // Use padding instead of absolute positioning
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
      width: "80%",
    },

    tabItem: {
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0, // Prevent shrinking of icons or content
    },

    checkoutButton: {
      width: 45,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0, // Prevent shrinking
    },
    checkoutImage: {
      width: 45,
      height: 30,
      resizeMode: "contain",
    },
  });

  // Define routes to exclude
  const routesToExclude = ["checkout", "login"];

  // Filter out the excluded routes
  const filteredRoutes = state.routes.filter(
    (route: any) => !routesToExclude.includes(route.name)
  );

  // Add checkout button after the first two routes and before the last route
  const firstTwoRoutes = filteredRoutes.slice(0, 1);
  const lastRoute = filteredRoutes.slice(1);

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
          {/* Render the first two routes */}
          {firstTwoRoutes.map((route: any) => (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabItem}
            >
              <Image
                source={
                  TABS[route.name as TabRoutes]?.[
                    route.key === state.routes[state.index].key
                      ? "active"
                      : "inactive"
                  ]
                }
                style={{
                  width: 36,
                  height: 36,
                  resizeMode: "contain",
                }}
              />
            </Pressable>
          ))}

          {/* Checkout button */}
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

          {/* Render the last route */}
          {lastRoute.map((route: any) => (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabItem}
            >
              <Image
                source={
                  TABS[route.name as TabRoutes]?.[
                    route.key === state.routes[state.index].key
                      ? "active"
                      : "inactive"
                  ]
                }
                style={{
                  width: route.name === "settings" ? 37 : 35,
                  height: route.name === "settings" ? 36 : 35,
                  resizeMode: "contain",
                }}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

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
