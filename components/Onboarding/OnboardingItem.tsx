import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";

export default function OnboardingItem({ item }: any) {
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 100,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 20,
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
      height: 105,
      width: 101,
    },
    title: {
      fontFamily: "Alegreya_500Medium",
      paddingTop: 20,
      fontSize: 32,
      marginBottom: 10,
      color: "#fff",
      textAlign: "center",
      width: item.id === 0 ? "60%" : "80%",
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
    <View
      style={{
        ...styles.container,
        width,
        backgroundColor: "#13293D",
      }}
    >
      <Image
        source={require("@/assets/images/splash/ibex.png")}
        style={styles.image}
      />
      <Text
        style={{
          ...styles.title,
          marginTop: item.id === "4" ? 150 : 0,
        }}
      >
        {item.title}
      </Text>

      {item.id === "4" ? (
        <View style={{ flexDirection: "column", gap: 3, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 20,
              color: "#ECFF78",
              textAlign: "center",
            }}
          >
            {item.subtitle}{" "}
          </Text>
          <Image source={require("@/assets/images/info-icon.png")} />
        </View>
      ) : (
        <Text style={styles.subtitle}>{item.subtitle} </Text>
      )}
      {item.image && (
        <Image
          source={item.image}
          style={{
            marginTop: 50,
          }}
        />
      )}
    </View>
  );
}
