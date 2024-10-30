import React, { useRef, useEffect, useState } from "react";
import { Animated, View, ViewProps } from "react-native";
import { useIsFocused } from "@react-navigation/native";

export default function withFadeIn(WrappedComponent: any) {
  return (props: any) => {
    const isFocused = useIsFocused();
    const opacity = useRef(new Animated.Value(0)).current;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (isFocused) {
        setIsVisible(true); // Set the component to visible when focused
        opacity.setValue(0);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 50, // Adjust the duration if needed
          useNativeDriver: true,
        }).start();
      } else {
        // Hide the component if not focused
        setIsVisible(false);
      }
    }, [isFocused, opacity]);

    if (!isVisible) {
      return null; // Do not render the component until the animation is triggered
    }

    return (
      <Animated.View style={{ flex: 1, opacity }}>
        <WrappedComponent {...props} />
      </Animated.View>
    );
  };
}
