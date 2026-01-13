import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const BrandDropdownMenu = () => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>{t("navigation.brand")}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});