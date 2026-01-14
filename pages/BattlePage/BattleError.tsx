import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const BattleError = () => {
  const { t } = useTranslation();

  return (
    <View className="min-h-screen flex items-center justify-center p-4">
      <View className="max-w-md p-4 border border-red-500 rounded bg-red-100">
        <Text className="font-bold text-red-800">Error</Text>
        <Text className="text-red-700">{t("battlePage.battleNotFound")}</Text>
      </View>
    </View>
  );
};
