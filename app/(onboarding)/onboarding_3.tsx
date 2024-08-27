import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const Onboarding3: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, from onboarding 3</Text>
      <Pressable
        style={{
          backgroundColor: "#13293D",
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={() => {
          console.log("Button pressed");
          router.push({
            pathname: "/",
          });
        }}
      >
        <Text
          style={{
            color: "#fff",
          }}
        >
          {" "}
          Back to home page
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Onboarding3;
