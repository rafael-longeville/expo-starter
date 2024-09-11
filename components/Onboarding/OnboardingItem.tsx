import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingItem({ item }: any) {
  const { height, width } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 20, // Added padding to ensure content doesn't touch the edges
    },
    initialContainer: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    initialImage: {
      flex: 1,
      justifyContent: "center",
    },
    image: {
      width: width * 0.6, // Responsive width
      height: 105, // Fixed height for other images
      resizeMode: "contain", // Ensure the image scales without distortion
    },
    title: {
      fontFamily: "Alegreya_500Medium",
      fontSize: 32,
      marginBottom: 10,
      color: "#fff",
      textAlign: "center",
      width: "80%", // Responsive width
    },
    subtitle: {
      fontFamily: "Poppins_400Regular",
      fontSize: 20,
      color: "#ECFF78",
      textAlign: "center",
    },
  });

  return item.id === "1" ? (
    <View style={[styles.initialContainer, { width }]}>
      <Image source={item.image} style={[styles.initialImage, { width }]} />
    </View>
  ) : (
    <SafeAreaView
      style={[styles.container, { width, backgroundColor: "#13293D" }]}
    >
      <Image
        source={require("@/assets/images/splash/ibex.png")}
        style={styles.image}
      />
      <Text
        style={{
          ...styles.title,
          marginTop: item.id === "4" ? "50%" : "10%",
        }}
      >
        {item.title}
      </Text>

      {item.id === "4" ? (
        <View
          style={{ flexDirection: "column", gap: 20, alignItems: "center" }}
        >
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 20,
              color: "#ECFF78",
              textAlign: "center",
              height: 100,
            }}
          >
            {item.subtitle}{" "}
          </Text>
          <Image
            source={require("@/assets/images/info-icon.png")}
            style={{
              width: 20,
              height: 20,
            }}
          />
        </View>
      ) : (
        <Text style={styles.subtitle}>{item.subtitle} </Text>
      )}
      {item.image && (
        <Image
          source={item.image}
          style={{
            marginTop: 50,
            width: width * 0.9, // Responsive width
            height: height * 0.3, // Fixed height for other images
            resizeMode: "contain", // Ensure the image scales without distortion
          }}
        />
      )}
    </SafeAreaView>
  );
}
