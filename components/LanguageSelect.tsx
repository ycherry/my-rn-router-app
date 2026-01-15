import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface LanguageSelectProps {
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelect = ({ onLanguageChange }: LanguageSelectProps) => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    if (onLanguageChange) {
      onLanguageChange(newLang);
    } else {
      i18n.changeLanguage(newLang);
    }
  };

  return (
    <TouchableOpacity onPress={toggleLanguage} style={styles.container}>
      <Text style={styles.text}>{i18n.language.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
});