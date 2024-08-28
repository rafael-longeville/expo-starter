import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import {
  getIconSource,
  getCurrencySymbol,
  gainContainerStyle,
} from "./StyleFunctions";

// Define the props interface
interface InvestmentCardProps {
  investment: string;
  investing?: boolean;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  investing = false, // Default value for investing
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Image
          style={styles.euroIcon}
          source={getIconSource(investing, investment)}
        />
        <Text style={styles.headerText}>
          {t("components.investment_card.investment")} {investment} :{" "}
          <Text style={styles.headerAmount}>0 €*</Text>
        </Text>
      </View>

      <View style={styles.flexContainer}>
        <View style={styles.flexInputContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              placeholder="0"
              placeholderTextColor="rgba(19, 41, 61, 0.60)"
            />
          </View>
          <Text style={styles.asideInputText}>
            {getCurrencySymbol(investing, investment)}
          </Text>
        </View>
        <View style={gainContainerStyle(investing)}>
          <Text style={styles.rendementText}>
            {t("components.investment_card.yield")} :
          </Text>
          <Text style={styles.rendementValue}>7,85 %</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.6}>
        <Image
          source={require("@/assets/images/button-shape.png")}
          style={styles.buttonImage}
        />
        <Text style={styles.depositButtonText}>
          {t("components.investment_card.deposit")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InvestmentCard;
