import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, FlatList, Animated } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import OnboardingItem from "./OnboardingItem";
import Paginator from "./Paginator";
import NextButton from "./NextButton";
import slides from "./slides";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Explicitly type the slidesRef as a reference to FlatList
  const slidesRef = useRef<FlatList<any>>(null);

  // Reset the onboarding process to the first slide whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (slidesRef.current) {
        slidesRef.current.scrollToIndex({ index: 0, animated: true });
        setCurrentIndex(0); // Reset the index as well
      }
    }, [])
  );

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push({
        pathname: "/(onboarding)/onboarding_1",
      });
      try {
        await AsyncStorage.setItem("hasSeenSplash", "true");
      } catch (error) {
        console.error("Error storing data: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slides}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View
        style={{
          position: "absolute",
          bottom: -29,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          width: "100%",
        }}
      >
        <NextButton
          scrollTo={scrollTo}
          percentage={(currentIndex + 1) * (100 / slides.length)}
        />
        <Paginator data={slides} scrollX={scrollX} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
