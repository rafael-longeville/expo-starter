import React, { forwardRef, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Notifications from "expo-notifications";
import { Divider } from "react-native-paper";
import { TextInput } from "react-native-gesture-handler";
import { useStayUpdatedModalContext } from "@/context/StayUpdatedModalContext";

// Regular expression to validate the email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Custom Switch component to toggle notifications
const CustomSwitch: React.FC<{ value: boolean; onValueChange: () => void }> = ({
  value,
  onValueChange,
}) => {
  const handlePress = async () => {
    if (value) {
      onValueChange();
    } else {
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        onValueChange();
      } else {
        Alert.alert(
          "Permission Required",
          "This app needs permission to show notifications.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.switchContainer, styles.switch]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.switchThumb,
          value ? styles.switchThumbOn : styles.switchThumbOff,
        ]}
      >
        {value ? (
          <Image
            source={require("@/assets/images/onboarding/6/check-icon.png")}
            style={styles.iconImageOn}
          />
        ) : (
          <Image
            source={require("@/assets/images/onboarding/6/cross-icon.png")}
            style={styles.iconImage}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const Onboarding6 = forwardRef(({ setIsREF }: any, ref: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(false);
  const [email, setEmail] = React.useState("");
  // Handle modal
  const { setIsBlurred, isBlurred, setIsModalOpen } =
    useStayUpdatedModalContext();

  const handlePress = (ref: any) => {
    if (!emailNotifications && !notifications) {
      // Case 1: No notifications enabled
      console.log("here");
      setIsModalOpen(true);
      setIsBlurred(true);
      ref.current?.present();
      return;
    }

    if (emailNotifications && !email) {
      // Case 2: Email notifications enabled but no email provided
      Alert.alert("Error", "Please enter your email address.", [
        { text: "OK" },
      ]);
      return;
    }

    if (emailNotifications && !emailRegex.test(email)) {
      // Case 3: Invalid email format
      Alert.alert("Error", "Please enter a valid email address.", [
        { text: "OK" },
      ]);
      return;
    }

    if (notifications && emailNotifications && emailRegex.test(email)) {
      // Case 4: Both notifications enabled and valid email provided
      router.navigate("/(onboarding)/onboarding_7");
      return;
    }

    if (notifications && !emailNotifications) {
      // Case 5: Only push notifications enabled
      router.navigate("/(onboarding)/onboarding_7");
      return;
    }

    if (emailNotifications && emailRegex.test(email)) {
      // Case 6: Only email notifications enabled with valid email
      Alert.alert("Info", "Email notifications have been enabled.", [
        { text: "OK" },
      ]);
      return;
    }
  };

  return (
    <View style={{ paddingHorizontal: 30 }}>
      <View style={{ flexDirection: "column", gap: 20 }}>
        <Text
          style={{
            ...globalFonts.bigTitle,
            ...styles.title,
          }}
        >
          {t("pages.onboarding_6.title")}
        </Text>
        <Text
          style={{
            ...globalFonts.subtitle,
            fontSize: scaledFontSize(20),
            textAlign: "center",
          }}
        >
          {t("pages.onboarding_6.subtitle")}
        </Text>
      </View>
      {/* Notifications and custom switch section  */}
      <View style={{ flexDirection: "column", gap: 40 }}>
        <View
          style={{
            marginTop: 60,
            flexDirection: "column",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Text
              style={{
                ...globalFonts.title,
                fontSize: scaledFontSize(14),
                width: "65%",
                textAlign: "left",
              }}
            >
              {t("pages.onboarding_6.push.cta")}
            </Text>
            <CustomSwitch
              value={notifications}
              onValueChange={() => {
                setNotifications(!notifications);
              }}
            />
          </View>
          <Text
            style={{
              ...globalFonts.disclaimerText,
              fontSize: scaledFontSize(14),
              textAlign: "left",
              lineHeight: 16,
            }}
          >
            {t("pages.onboarding_6.push.cta_disclaimer")}
            {"\n"}
            {t("pages.onboarding_6.push.cta_disclaimer_2")}
          </Text>
        </View>
        <Divider
          style={{
            height: 1,
            backgroundColor: "#212121",
          }}
        />
        <View
          style={{
            flexDirection: "column",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Text
              style={{
                ...globalFonts.title,
                fontSize: scaledFontSize(14),
                width: "65%",
                textAlign: "left",
              }}
            >
              {t("pages.onboarding_6.mail.cta")}
            </Text>
            <CustomSwitch
              value={emailNotifications}
              onValueChange={() => {
                setEmailNotifications(!emailNotifications);
              }}
            />
          </View>
          <Text
            style={{
              ...globalFonts.disclaimerText,
              fontSize: scaledFontSize(14),
              textAlign: "left",
              lineHeight: 16,
            }}
          >
            {t("pages.onboarding_6.mail.cta_disclaimer")}
          </Text>

          <TextInput
            placeholder={t("pages.onboarding_6.mail.input_placeholder")}
            placeholderTextColor="#212121" // Sets placeholder color
            style={{
              width: "60%",
              height: 40,
              borderRadius: 65,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#212121",
              color: "#212121", // Sets text color
              textAlign: "center",
              alignSelf: "center",
              // display: emailNotifications ? "flex" : "none",
              display: "flex",
              marginTop: 10,
            }}
            value={email}
            onChange={(e) => setEmail(e.nativeEvent.text)}
          />

          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#333333" }}
            onPress={() => handlePress(ref)}
          >
            <Text style={styles.buttonText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionContainer: {
    marginTop: 20,
    flexDirection: "column",
    justifyContent: "center",
    gap: 15,
  },
  socialsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 60,
  },
  switchContainer: {
    width: 70,
    height: 40,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 2,
    borderWidth: 4,
    borderColor: "#333333",
  },
  switch: {
    backgroundColor: "#0C0C0C",
  },
  switchThumb: {
    width: 25,
    height: 25,
    borderRadius: 52.5,
    justifyContent: "center",
    alignItems: "center",
  },
  switchThumbOn: {
    backgroundColor: "#333333",
    transform: [{ translateX: 15 }],
    borderWidth: 1,
    borderColor: "#474747",
  },
  switchThumbOff: {
    backgroundColor: "#333333",
    transform: [{ translateX: -15 }],
    borderWidth: 1,
    borderColor: "#474747",
  },
  switchIcon: {
    fontSize: scaledFontSize(16),
    color: "#13293D",
  },
  image: {
    width: 60,
    height: 60,
  },
  iconImage: {
    width: 13,
    height: 13,
  },
  iconImageOn: {
    width: 16,
    height: 16,
    shadowColor: "#6EE7B7", // Green shadow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8, // Adjust the shadow radius as desired
    borderRadius: 8,
  },
  title: {
    fontSize: scaledFontSize(22),
    textAlign: "center",
  },
  button: {
    marginTop: 80,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 37,
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: scaledFontSize(14),
    fontFamily: "Poppins_500Medium",
    color: "#FFFFFF",
    fontWeight: "500",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
});

export default Onboarding6;
