import { router, Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { View, Pressable, Text, StyleSheet } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const handleGoToLogin = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {
            display: route.name === "splash" ? "none" : "flex",
          },
        })}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="login" />
      </Tabs>

      {/* Add the login button */}
      <Pressable style={styles.loginButton} onPress={handleGoToLogin}>
        <Text style={styles.loginButtonText}>Go to Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loginButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#13293D",
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
