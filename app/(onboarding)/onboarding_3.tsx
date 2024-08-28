import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { WebView } from 'react-native-webview';

const Onboarding3: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, from onboarding 3</Text>
      <WebView
      style={styles.webview}
      source={{ uri: 'https://expo.dev' }}
    />
      <Pressable
        style={{
          backgroundColor: "#13293D",
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
        onPress={() => {
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
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  webview: {
    flex: 1,
  },
});

export default Onboarding3;
