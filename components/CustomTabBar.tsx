import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";

type TabRoutes = "home" | "settings" | "account";

const CustomTabBar: React.FC<BottomTabBarProps> = (props) => {
  const { state, descriptors, navigation } = props;
  const { isCheckoutModalOpen, setIsCheckoutModalOpen } =
    useStayUpdatedModalContext();

  const TABS: Record<TabRoutes, { active?: any; inactive: any }> = {
    home: {
      active: require("@/assets/images/tabs/home-active.png"),
      inactive: require("@/assets/images/tabs/home.png"),
    },
    settings: {
      active: require("@/assets/images/tabs/settings-active.png"),
      inactive: require("@/assets/images/tabs/settings.png"),
    },
    account: {
      active: require("@/assets/images/tabs/account-active.png"),
      inactive: require("@/assets/images/tabs/account.png"),
    },
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          if (route.name === "checkout") {
            setIsCheckoutModalOpen(true);
          } else {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Image
              source={
                TABS[route.name as TabRoutes]?.[
                  isFocused ? "active" : "inactive"
                ]
              }
              style={{
                width: route.name === "settings" ? 37 : 35,
                height: route.name === "settings" ? 36 : 35,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => setIsCheckoutModalOpen(true)}
      >
        <Image
          source={require("../../assets/images/tabs/checkout.png")}
          style={styles.checkoutImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    display: "flex",
    flexDirection: "row",
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
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButton: {
    width: 45,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  checkoutImage: {
    width: 45,
    height: 30,
    resizeMode: "contain",
  },
});

export default CustomTabBar;
