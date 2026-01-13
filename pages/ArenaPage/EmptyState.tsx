import { useThemeColor } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const EmptyState = () => {
  const { t } = useTranslation();

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View className="p-20 items-center justify-center border border-gray-300 rounded-lg" style={{ backgroundColor }}>
      <Ionicons name="flash" size={64} color={textColor} />
      <Text className="text-lg mt-4 mb-2" style={{ color: textColor }}>
        {t("arenaPage.noBattles")}
      </Text>
      <Text className="text-sm" style={{ color: textColor }}>
        {t("arenaPage.adjustFiltersOrCreate")}
      </Text>
    </View>
  );
};

