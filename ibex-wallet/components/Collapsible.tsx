import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  Easing,
} from "react-native";

interface CollapsibleProps {
  title: string;
  isOpen: boolean;
  children: React.ReactNode;
}

export function Collapsible({ children, isOpen }: CollapsibleProps) {
  // Animated value to control the height
  const animatedHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Enable layout animation on Android
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    Animated.timing(animatedHeight, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false, // We animate height, so native driver can't be used
    }).start();
  }, [isOpen]);

  // Interpolating the height animation
  const heightInterpolation = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60], // Adjust the final height according to your content
  });

  return (
    <Animated.View style={[styles.content, { height: heightInterpolation }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "transparent",
    overflow: "hidden", // Ensure content doesn't overflow when collapsing
  },
});
