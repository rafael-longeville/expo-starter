import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  TouchableOpacity,
} from "react-native";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Notifications from "expo-notifications";
import { Divider } from "react-native-paper";
import { TextInput } from "react-native-gesture-handler";

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
            style={styles.iconImage}
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

const Onboarding6: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState(false);
  const [emailNotifications, setEmailNotifications] = React.useState(false);
  const [email, setEmail] = React.useState("");

  return (
    <View>
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
          }}
        >
          {t("pages.onboarding_6.push.cta_disclaimer")}
          {"\n"}
          {t("pages.onboarding_6.push.cta_disclaimer_2")}
        </Text>
      </View>
      <Divider
        style={{ marginVertical: 20, height: 1, backgroundColor: "#212121" }}
      />
      <View
        style={{
          marginTop: 40,
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
          }}
        >
          {t("pages.onboarding_6.mail.cta_disclaimer")}
        </Text>

        <TextInput
          placeholder={t("pages.onboarding_6.mail.input_placeholder")}
          style={{
            width: "60%",
            height: 40,
            borderRadius: 65,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: "#212121",
            color: "#212121",
            textAlign: "center",
            alignSelf: "center",
          }}
        ></TextInput>
      </View>
    </View>
  );
};

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
    width: 10,
    height: 10,
  },
  title: {
    fontSize: scaledFontSize(22),
    textAlign: "center",
  },
});

export default Onboarding6;
