import React, { forwardRef } from "react";
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
import { LinearGradient } from "expo-linear-gradient";

// Regular expression to validate the email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CustomSwitch: React.FC<{
  value: boolean;
  onValueChange: () => void;
  isEmail?: boolean;
}> = ({ value, onValueChange, isEmail }) => {
  const handlePress = async () => {
    if (value || isEmail === true) {
      onValueChange();
    } else if (isEmail === undefined) {
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
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "rgba(102, 102, 102, 0.5)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[
          styles.switchThumb,
          value ? styles.switchThumbOn : styles.switchThumbOff,
        ]}
      >
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 52.5,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#333333",
          }}
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
      </LinearGradient>
    </TouchableOpacity>
  );
};

const Onboarding6 = forwardRef(({ setIsREF }: any, ref: any) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const { setIsBlurred, isBlurred, setIsModalOpen } =
    useStayUpdatedModalContext();

  const handleEmailUpdate = async () => {
    try {
      console.log("hi");
      const response = await fetch(
        "https://api-testnet.ibexwallet.org/account/email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      console.log(response);

      if (response.status === 200) {
        Alert.alert("Success", "Your email has been successfully updated!", [
          { text: "OK" },
        ]);
        router.navigate("/(onboarding)/onboarding_7");
      } else if (response.status === 409) {
        Alert.alert("Error", "This email address has already been added.", [
          { text: "OK" },
        ]);
      }
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert("Error", "Failed to update email. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const handlePress = () => {
    if (!emailNotifications && !notifications) {
      setIsModalOpen(true);
      setIsBlurred(true);
      ref.current?.present();
      return;
    }

    if (emailNotifications && !email) {
      Alert.alert("Error", "Please enter your email address.", [
        { text: "OK" },
      ]);
      return;
    }

    if (emailNotifications /* && emailRegex.test(email) */) {
      handleEmailUpdate();
      return;
    }

    if (notifications && !email) {
      router.push("/(onboarding)/onboarding_7");
      return;
    }

    if (notifications && !emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.", [
        { text: "OK" },
      ]);
      return;
    }
  };

  return (
    <View style={{ paddingHorizontal: 30 }}>
      <View style={{ flexDirection: "column", gap: 20 }}>
        <Text style={{ ...globalFonts.bigTitle, ...styles.title }}>
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
              onValueChange={() => setNotifications(!notifications)}
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
        <Divider style={{ height: 1, backgroundColor: "#212121" }} />
        <View
          style={{ flexDirection: "column", gap: 10, alignItems: "flex-start" }}
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
              onValueChange={() => setEmailNotifications(!emailNotifications)}
              isEmail={true}
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
          {emailNotifications && (
            <TextInput
              placeholder={t("pages.onboarding_6.mail.input_placeholder")}
              placeholderTextColor="#212121"
              style={{
                width: "80%",
                height: 40,
                borderRadius: 65,
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: "#212121",
                color: "#212121",
                textAlign: "center",
                alignSelf: "center",
                marginTop: 10,
              }}
              value={email}
              onChange={(e) => setEmail(e.nativeEvent.text)}
            />
          )}
          <TouchableOpacity
            style={{ ...styles.button, backgroundColor: "#333333" }}
            onPress={handlePress}
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
  button: {
    marginTop: 80,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 37,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
  switchContainer: {
    width: 70,
    height: 40,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 4,
    borderColor: "#333333",
  },
  switch: {
    backgroundColor: "#0C0C0C",
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 52.5,
    justifyContent: "center",
    alignItems: "center",
  },
  switchThumbOn: {
    backgroundColor: "#333333",
    transform: [{ translateX: 15 }],
  },
  switchThumbOff: {
    backgroundColor: "#333333",
    transform: [{ translateX: -15 }],
  },
  iconImage: {
    width: 10,
    height: 10,
    resizeMode: "contain",
  },
  iconImageOn: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
  title: {
    fontSize: scaledFontSize(22),
    textAlign: "center",
  },
});

export default Onboarding6;
