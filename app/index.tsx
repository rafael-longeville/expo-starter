/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { SafeAreaView } from "react-native";
import Onboarding from "@/components/Onboarding/Onboarding";
import { StatusBar } from "expo-status-bar";
import { StayUpdatedModalContentProvider } from "@/context/StayUpdatedModalContext";

const Splash = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
      <Onboarding />
    </SafeAreaView>
  );
};

export default Splash;
