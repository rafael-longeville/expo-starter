import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, FlatList, Animated } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingItem from "./OnboardingItem";
import Paginator from "./Paginator";
import NextButton from "./NextButton";

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const { t } = useTranslation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const slidesRef = useRef<FlatList<any>>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if the user has seen the splash screen
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

  // Timer to navigate to the next slide after 3 seconds of inactivity
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      scrollTo();
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setCurrentIndex(newIndex);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (slidesToRender.length > 1) {
        timerRef.current = setTimeout(() => {
          scrollTo();
        }, 3000);
      }
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const slides = [
    {
      id: "1",
      image: require("@/assets/images/splash/initial_splash.png"),
    },
    {
      id: "2",
      title: t("splash.1.title"),
      subtitle: t("splash.1.subtitle"),
      image: require("@/assets/images/splash/splash_1.png"),
    },
    {
      id: "3",
      title: t("splash.2.title"),
      subtitle: t("splash.2.subtitle"),
      image: require("@/assets/images/splash/splash_2.png"),
    },
    {
      id: "4",
      title: t("splash.3.title"),
      subtitle: t("splash.3.subtitle"),
    },
  ];

  const scrollTo = async () => {
    if (slidesToRender.length > 1 && currentIndex < slidesToRender.length - 1) {
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

  const slidesToRender = hasSeenSplash ? [slides[0]] : slides;

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slidesToRender}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
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
          bottom: -100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: 300,
        }}
      >
        <View style={{ display: "flex", flexDirection: "column", height: 300 }}>
          <View style={{ height: "50%" }}>
            <NextButton
              scrollTo={scrollTo}
              percentage={(currentIndex + 1) * (100 / slides.length)}
            />
          </View>
          <View style={{ height: "50%" }}>
            {currentIndex !== 0 && (
              <Paginator data={slides} scrollX={scrollX} />
            )}
          </View>
        </View>
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
