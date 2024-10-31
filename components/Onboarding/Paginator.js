import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Text,
} from "react-native";

const Paginator = ({ data, currentIndex }) => {
  return (
    <View style={{ flexDirection: "row", height: "100%", gap: 5 }}>
      {data.map((_, i) => {
        // Determine background color based on current index
        const backgroundColor = currentIndex === i + 1 ? "#6EE7B7" : "#525252"; // i + 1 adjusts index for 0-based array

        return (
          <View style={[styles.dot, { backgroundColor }]} key={i.toString()} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    height: 13,
    borderRadius: 10,
    marginHorizontal: 8,
    width: 13, // Fixed width for dots
  },
});

export default Paginator;
