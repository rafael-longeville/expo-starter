import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, FlatList, Animated, LogBox } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingItem from "./OnboardingItem";
import Paginator from "./Paginator";
import NextButton from "./NextButton";

LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notifications from FlatList

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const { t } = useTranslation();
  const scrollX = useRef(new Animated.Value(0)).current;

  const slidesRef = useRef<FlatList<any>>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer reference
  const isScrolling = useRef(false); // To track ongoing scroll operations

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

  // Set up a timer to navigate to the next slide after 3 seconds of inactivity
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
      setCurrentIndex(viewableItems[0].index);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        scrollTo();
      }, 3000);
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

  const slidesToRender = hasSeenSplash ? [slides[0]] : slides;
  const scrollTo = async () => {
    console.log("scrollTo called", {
      isScrolling: isScrolling.current,
      currentIndex,
    });

    if (isScrolling.current) return; // Prevent multiple scroll operations
    isScrolling.current = true; // Set the flag to true

    try {
      if (currentIndex < slides.length - 1) {
        console.log("Scrolling to next index:", currentIndex + 1);
        slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      } else {
        console.log("Checking AsyncStorage for settingsDone and transakDone");
        const settingsDone = await AsyncStorage.getItem("settingsDone");
        const transakDone = await AsyncStorage.getItem("transakDone");

        if (settingsDone === "true" && transakDone === "true") {
          console.log("Navigating to /onboarding_3");
          router.push({ pathname: "/(onboarding)/onboarding_3" });
        } else if (settingsDone === "true") {
          console.log("Navigating to /onboarding_2");
          router.push({ pathname: "/(onboarding)/onboarding_2" });
        }
        else {
          console.log("Navigating to /onboarding_1");
          router.push({ pathname: "/(onboarding)/onboarding_1" });
        }

        await AsyncStorage.setItem("hasSeenSplash", "true");
      }
    } catch (error) {
      console.error("Error scrolling to next slide or navigating: ", error);
      const settingsDone = await AsyncStorage.getItem("settingsDone");
      const transakDone = await AsyncStorage.getItem("transakDone");

      if (settingsDone === "true" && transakDone === "true") {
        console.log("Navigating to /onboarding_3");
        router.push({ pathname: "/(onboarding)/onboarding_3" });
      } else if (settingsDone === "true") {
        console.log("Navigating to /onboarding_2");
        router.push({ pathname: "/(onboarding)/onboarding_2" });
      }
      else {
        console.log("Navigating to /onboarding_1");
        router.push({ pathname: "/(onboarding)/onboarding_1" });
      }
    } finally {
      isScrolling.current = false; // Reset the flag
      console.log("scrollTo completed", { isScrolling: isScrolling.current });
    }
  };

  const handleNextButtonPress = () => {
    console.log("Next button pressed", { isScrolling: isScrolling.current });

    if (isScrolling.current) return; // Prevent multiple triggers

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    scrollTo();
  };

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
              scrollTo={handleNextButtonPress}
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
