import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function NextButton({ percentage, scrollTo }) {
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  const size = 70;
  const strokeWidth = 1.5;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const progressRef = useRef(null);

  useEffect(() => {
    const checkIfSeenSplash = async () => {
      try {
        const value = await AsyncStorage.getItem("hasSeenSplash");
        if (value === "true") {
          setHasSeenSplash(true);
        }
      } catch (error) {
        console.error("Error retrieving data: ", error);
      }
    };

    checkIfSeenSplash();
  }, []);

  const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
  }, [percentage]);

  useEffect(() => {
    progressAnimation.addListener(
      (value) => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 100;

        if (progressRef?.current) {
          progressRef.current.setNativeProps({
            strokeDashoffset,
          });
        }
      },
      [percentage]
    );

    return () => {
      progressAnimation.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={scrollTo} style={styles.button}>
        <Image
          source={require("@/components/Onboarding/button.png")}
          style={{
            height: 64,
            width: 64,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 64,
    width: 64,
    borderRadius: 100,
  },
});
