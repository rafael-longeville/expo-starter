import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Linking,
  Modal,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";
import { globalFonts, scaledFontSize } from "@/app/styles/globalFonts";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import { router } from "expo-router";
import { Wallet, WalletId } from "thirdweb/wallets";
import withFadeIn from "@/components/effects/withFadeIn";
import { ScrollView } from "react-native-gesture-handler";
import * as CONFIG from "../../app.json";
import * as EAS from "../../eas.json";
import { client } from "@/constants/thirdweb";
import PasskeyComponent from "@/components/PasskeyComponent/PasskeyComponent";

interface AccountDetailsProps {
  currency: string;
  main_account_balance: string;
  investment_account_balance: string;
  total_balance: string;
}

function Account({
  currency,
  main_account_balance,
  investment_account_balance,
  total_balance,
}: AccountDetailsProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);

  // Always call hooks at the top level
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();

  // Render conditionally based on the state but avoid conditional hooks
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.account_details}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ ...globalFonts.title, fontSize: scaledFontSize(28) }}
            >
              {t("pages.account.title")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
              }}
            >
              <Pressable
                onPress={() =>
                  Linking.openURL("https://docs.wallet.civicpower.org/")
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Image
                  source={require("../../assets/images/account/interrogation-icon.png")}
                  style={{
                    width: 28,
                    height: 28,
                  }}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: 20,
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
            marginBottom: 120,
          }}
        >
          <View style={styles.optionsContainer}>
            <OptionRow label={"pages.account.rate_wallet"} t={t} isTopRow />
            <OptionRow label={"pages.account.help_center"} t={t} />
            <OptionRow label={"pages.account.contact_us"} t={t} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
              gap: 8,
              marginBottom: 40,
            }}
          >
            <Image
              source={require("../../assets/images/account/heart.png")}
              style={styles.heartIcon}
            />
            <Text
              style={{
                ...globalFonts.mediumSubtitle,
                fontSize: scaledFontSize(14),
              }}
            >
              {t("pages.account.make_a_donation")}
            </Text>

            <Image
              source={require("../../assets/images/account/heart.png")}
              style={styles.heartIcon}
            />
          </View>
          {/* Conditional rendering for account information */}
          {account ? (
            <View>
              <Text
                style={{
                  ...globalFonts.disclaimerText,
                  fontSize: scaledFontSize(14),
                }}
              >
                {t("pages.account.public_adress")}
              </Text>
              <Pressable
                onPress={() => {
                  if (account.address) {
                    Linking.openURL(
                      `https://sepolia.arbiscan.io/address/${account.address}`
                    );
                  }
                }}
              >
                <Text
                  style={{
                    ...globalFonts.disclaimerText,
                    textDecorationLine: "underline",
                  }}
                >
                  {account.address}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsQRModalVisible(true)}
                style={{ marginTop: 20 }}
              >
                <Text
                  style={{
                    ...globalFonts.disclaimerText,
                    textDecorationLine: "underline",
                  }}
                >
                  {t("pages.account.show_qr_code")}
                </Text>
              </Pressable>
              <Modal
                visible={isQRModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsQRModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <QRCode
                      value={`https://sepolia.arbiscan.io/address/${account.address}`}
                      size={200}
                      color="black"
                      backgroundColor="white"
                    />
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setIsQRModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>
                        {t("pages.account.close")}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            </View>
          ) : null}
          {/* Conditional rendering for wallet */}
          {wallet && (
            <Pressable
              style={styles.button}
              onPress={() => {
                disconnect(wallet);
                router.push("/(onboarding)/onboarding_3");
              }}
            >
              <Text style={styles.buttonText}>
                {t("pages.account.disconnect")}
              </Text>
            </Pressable>
          )}
          <Text
            style={{
              ...globalFonts.disclaimerText,
              textAlign: "center",
            }}
          >
            Version {CONFIG.expo.ios.buildNumber}.3
          </Text>
          <PasskeyComponent />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// OptionRow Component for each row in the list
const OptionRow = ({
  label,
  t,
  isTopRow,
}: {
  label: string;
  t: any;
  isTopRow?: boolean;
}) => {
  const url = t(`${label}.href`);
  const handlePress = () => {
    Linking.openURL(url);
  };

  return (
    <Pressable style={styles.optionRow} onPress={handlePress}>
      <Text style={globalFonts.mediumTitle}>{t(`${label}.title`)}</Text>
      <Image
        source={require("../../assets/images/account/arrow.png")}
        style={styles.arrowIcon}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#13293D",
    padding: 10,
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 335,
  },
  buttonText: {
    ...globalFonts.whiteSubtitle,
    textAlign: "center",
    fontSize: scaledFontSize(14),
    fontFamily: "Poppins_500Medium",
  },
  account_details: {
    backgroundColor: "#ECFF78",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  optionsContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 0,
    width: "100%",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  optionText: {
    fontSize: scaledFontSize(16),
    fontFamily: "Poppins_500Medium",
    color: "#13293D",
  },
  heartIcon: {
    width: 20,
    height: 20,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: "#13293D",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "Poppins_500Medium",
  },
});

const EnhancedAccount = withFadeIn(Account);

export default process.env.EXPO_PUBLIC_IS_DEVELOPMENT
  ? Account
  : EnhancedAccount;
