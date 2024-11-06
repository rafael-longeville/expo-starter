import { scaledFontSize } from "@/app/styles/globalFonts";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Image,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingItem({ item }: any) {
  const { height, width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity set to 0 for fade-in effect
  const multiplierValue = item.id === "4" ? 0.45 : 0.2;
  const marginValue = item.id === "4" ? "-17%" : "10%";

  useEffect(() => {
    // Reset fadeAnim to 0 before starting the animation for smoothness
    fadeAnim.setValue(0);

    // Trigger smooth fade-in animation when the component mounts or item changes
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate to full opacity
      duration: 1600, // Shorter duration for a smoother, quicker transition
      useNativeDriver: true,
      easing: Easing.out(Easing.quad), // Smooth easing function
    }).start();
  }, [item.id]); // Run the animation when item.id changes

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 20, // Added padding to ensure content doesn't touch the edges
    },
    initialContainer: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 40,
    },
    initialImage: {
      height: 200,
      width: 200,
      resizeMode: "contain",
    },
    image: {
      width: width * 0.6, // Responsive width
      height: 105, // Fixed height for other images
      resizeMode: "contain", // Ensure the image scales without distortion
    },
    title: {
      fontFamily: "AlegreyaSansSC_500Medium",
      fontSize: scaledFontSize(30),
      marginBottom: 10,
      color: "#fff",
      textAlign: "center",
      width: "90%", // Responsive width
    },
    subtitle: {
      fontFamily: "Poppins_400Regular",
      fontSize: scaledFontSize(18),
      color: "#6EE7B7",
      textAlign: "center",
      width: "90%", // Responsive width
    },
  });

  return item.id === "1" ? (
    <View style={[styles.initialContainer, { width }]}>
      <Image source={item.image} style={styles.initialImage} />

      <View style={{ flexDirection: "column", gap: 10 }}>
        <Text
          style={{
            fontFamily: "AlegreyaSansSC_800ExtraBold",
            fontSize: scaledFontSize(60),
            color: "#fff",
            textAlign: "center",
            lineHeight: scaledFontSize(60),
          }}
        >
          IBEx
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_400Regular",
            fontSize: scaledFontSize(60),
            color: "#6EE7B7",
            textAlign: "center",
            lineHeight: scaledFontSize(60),
          }}
        >
          Wallet
        </Text>
      </View>
    </View>
  ) : (
    <SafeAreaView
      style={[
        styles.container,
        {
          width,
          backgroundColor: "transparent", // Make sure the container background is transparent
        },
      ]}
    >
      {/* Animated image for fade-in effect */}
      <Animated.Image
        source={require("@/assets/images/splash/ibex.png")}
        style={styles.image} // Apply the fadeAnim opacity to this image
      />

      {item.id === "4" ? (
        <View
          style={{
            flexDirection: "column",
            gap: 30,
            alignItems: "center",
            width,
            padding: 20,
          }}
        >
          {/* Main Content */}
          <Text
            style={{
              ...styles.title,
              marginTop: "10%",
            }}
          >
            {item.first_title}
          </Text>
          <Text style={styles.subtitle}>{item.first_subtitle}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      ) : (
        <>
          <Text
            style={{
              ...styles.title,
              marginTop: item.id === "4" ? "50%" : "10%",
            }}
          >
            {item.title}
          </Text>
          <Text style={styles.subtitle}>{item.subtitle} </Text>
        </>
      )}
      {item.image && (
        <Animated.Image
          source={item.image}
          style={{
            marginTop: marginValue,
            width: width, // Responsive width
            height: height * multiplierValue, // Fixed height for other images
            resizeMode: "contain", // Ensure the image scales without distortion
            opacity: fadeAnim, // Apply fade-in opacity to this image as well
          }}
        />
      )}
      {item.id === "3" && (
        <Text
          style={{
            ...styles.subtitle,
            fontSize: scaledFontSize(18),
          }}
        >
          {item.second_subtitle_1}{" "}
          <Text
            style={{
              ...styles.subtitle,
              fontSize: scaledFontSize(18),
              fontFamily: "Poppins_700Bold",
            }}
          >
            {item.second_subtitle_2}{" "}
          </Text>
          {item.second_subtitle_3}
        </Text>
      )}
    </SafeAreaView>
  );
}
