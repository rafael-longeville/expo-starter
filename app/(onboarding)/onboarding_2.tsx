import InvestmentCard from "@/components/InvestmentCard/InvestmentCard";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
  ScrollView,
} from "react-native";
import { Divider } from "react-native-paper";
import { globalFonts, scaledFontSize } from "../styles/globalFonts";
import * as Sentry from "@sentry/react-native";
import { useTranslation } from "react-i18next";

// Define the prop types
interface Onboarding2Props {
  scrollViewRef: React.RefObject<ScrollView>;
}

const Onboarding2: React.FC<Onboarding2Props> = ({ scrollViewRef }) => {
  const { t } = useTranslation();
  const [dollarCardY, setDollarCardY] = useState<number | null>(null);
  const [euroCardY, setEuroCardY] = useState<number | null>(null);
  const [dollarCCCardY, setDollarCCCardY] = useState<number | null>(null);

  // Function to scroll to a specific card position
  const scrollToCard = (yPosition: number | null) => {
    if (scrollViewRef?.current && yPosition !== null) {
      console.log("Scrolling to card position", (yPosition as number) + 40);

      scrollViewRef.current.scrollTo({ y: yPosition + 40, animated: true });
    }
  };

  // Capture a breadcrumb when the component mounts
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "Onboarding2 screen loaded",
      level: "info",
    });
  }, []);

  // Handlers for layout changes
  const handleDollarCardLayout = (event: LayoutChangeEvent) => {
    setDollarCardY(event.nativeEvent.layout.y);
  };

  const handleEuroCardLayout = (event: LayoutChangeEvent) => {
    setEuroCardY(event.nativeEvent.layout.y);
  };

  const handleDollarCCCardLayout = (event: LayoutChangeEvent) => {
    setDollarCCCardY(event.nativeEvent.layout.y);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <Text style={globalFonts.title}>{t("pages.onboarding_2.title")}</Text>
        <Text style={globalFonts.subtitle}>
          {t("pages.onboarding_2.subtitle_1")}{" "}
          <Text style={{ fontFamily: "Poppins_700Bold" }}>
            {t("pages.onboarding_2.subtitle_2")}
          </Text>{" "}
          {t("pages.onboarding_2.subtitle_3")}
        </Text>
        <Text style={{ ...globalFonts.disclaimerText }}>
          {t("pages.onboarding_2.disclaimer")}
        </Text>
      </View>

      <InvestmentCard
        onLayout={handleDollarCardLayout}
        investment="DOLLAR US"
        investing={true}
        isOnboarding={true}
        scrollViewRef={scrollViewRef}
        onFocusInput={() => scrollToCard(dollarCardY)} // Scroll when input is focused
      />

      <InvestmentCard
        onLayout={handleEuroCardLayout}
        investment="EURO"
        investing={true}
        isOnboarding={true}
        scrollViewRef={scrollViewRef}
        onFocusInput={() => scrollToCard(euroCardY)} // Scroll when input is focused
      />

      <Divider
        style={{
          backgroundColor: "#13293D",
          opacity: 0.3,
          height: 1.5,
        }}
      />

      <Text style={globalFonts.title}>
        {t("pages.onboarding_2.second_title")}
      </Text>

      <Text style={globalFonts.subtitle}>
        {t("pages.onboarding_2.second_subtitle_1")}{" "}
        <Text style={{ fontFamily: "Poppins_700Bold" }}>
          {t("pages.onboarding_2.second_subtitle_2")}
        </Text>{" "}
        {t("pages.onboarding_2.second_subtitle_3")}
      </Text>

      <InvestmentCard
        onLayout={handleDollarCCCardLayout}
        investment="DOLLAR US"
        investing={false}
        isOnboarding={true}
        scrollViewRef={scrollViewRef}
        onFocusInput={() => scrollToCard(dollarCCCardY)} // Scroll when input is focused
      />
    </View>
  );
};

// Type-safe styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    marginBottom: 100,
  },
});

export default Onboarding2;
