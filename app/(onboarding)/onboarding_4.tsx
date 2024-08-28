import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { globalFonts } from "../styles/globalFonts";
import { useTranslation } from "react-i18next";
import { Divider, Switch } from "react-native-paper";

const Onboarding4: React.FC = () => {
  const { t } = useTranslation();

  // State to track the selected currency
  const [selectedCurrency, setSelectedCurrency] = useState<
    "euro" | "dollar" | null
  >(null);
  const [notifications, setNotifications] = useState<boolean>(true);

  return (
    <View style={styles.container}>
      <View>
        <Text style={globalFonts.title}>{t("pages.onboarding_4.title")}</Text>
        <Text style={globalFonts.subtitle}>
          {t("pages.onboarding_4.subtitle")}
        </Text>
      </View>
      <View style={{ flexDirection: "column", gap: 15, width: "100%" }}>
        <View style={{ flexDirection: "column", gap: 5, width: "100%" }}>
          <Text style={styles.questionText}>
            {t("pages.onboarding_4.money_question")}
          </Text>
          <Text style={styles.descriptionText}>
            {t("pages.onboarding_4.money_question_helper")}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={[
              styles.commonButtonStyle,
              selectedCurrency === "euro" && styles.isSelectedButtonStyle,
            ]}
            onPress={() => setSelectedCurrency("euro")}
          >
            <Text
              style={{
                fontSize: 16,
                color:
                  selectedCurrency === "euro"
                    ? "#13293D"
                    : "rgba(19, 41, 61, .7)",
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Euro (€)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.commonButtonStyle,
              selectedCurrency === "dollar" && styles.isSelectedButtonStyle,
            ]}
            onPress={() => setSelectedCurrency("dollar")}
          >
            <Text
              style={{
                fontSize: 16,
                color:
                  selectedCurrency === "dollar"
                    ? "#13293D"
                    : "rgba(19, 41, 61, .7)",
                fontFamily: "Poppins_600SemiBold",
              }}
            >
              Dollar US ($)
            </Text>
          </TouchableOpacity>
        </View>
        <Divider style={{ width: "100%", height: 1.5 }} />
        <View style={{ flexDirection: "column", gap: 5, width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text style={styles.questionText}>
              {t("pages.onboarding_4.notifications_question")}
            </Text>
            <Switch
              value={notifications}
              onValueChange={() => setNotifications(!notifications)}
            />
          </View>
          <Text style={styles.descriptionText}>
            {t("pages.onboarding_4.notifications_question_helper")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 20,
  },
  questionText: {
    fontSize: 14,
    color: "#13293D",
    fontFamily: "Poppins_600SemiBold",
    width: "80%", // Ensure the text takes full width of the container
  },
  descriptionText: {
    fontSize: 12,
    color: "#13293D",
    opacity: 0.7,
    fontFamily: "Poppins_400Regular",
    width: "100%", // Ensure the text takes full width of the container
  },
  commonButtonStyle: {
    width: "47%",
    borderWidth: 2,
    height: 60,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(19, 41, 61, .5)",
  },
  isSelectedButtonStyle: {
    backgroundColor: "#ECFF78",
    borderColor: "#13293D",
  },
});

export default Onboarding4;
