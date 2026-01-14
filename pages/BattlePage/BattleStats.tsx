import type { CodeImplementation } from "@/lib/types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

interface BattleStatsProps {
  implementations: CodeImplementation[];
  totalVotes: number;
  category: string;
}

export const BattleStats: React.FC<BattleStatsProps> = ({
  implementations,
  totalVotes,
  category,
}) => {
  const { t } = useTranslation();

  return (
    <View className="p-6 max-w-4xl mx-auto border border-gray-300 rounded">
      <View className="flex-row flex-wrap gap-4">
        <View className="flex-1 text-center">
          <Text className="text-2xl font-bold text-cyan-400 mb-1">
            {implementations.length}
          </Text>
          <Text className="text-sm text-gray-500">
            {t("battlePage.combatants")}
          </Text>
        </View>
        <View className="flex-1 text-center">
          <Text className="text-2xl font-bold text-purple-400 mb-1">
            {totalVotes}
          </Text>
          <Text className="text-sm text-gray-500">
            {t("battlePage.totalVotes")}
          </Text>
        </View>
        <View className="flex-1 text-center">
          <Text className="text-sm font-semibold text-yellow-400 mb-1">
            {category}
          </Text>
          <Text className="text-sm text-gray-500">
            {t("battlePage.techStack")}
          </Text>
        </View>
        <View className="flex-1 text-center">
          <View className="flex-row flex-wrap justify-center gap-1 mb-1">
            {[
              ...new Set(
                implementations.flatMap(
                  (impl: CodeImplementation) => impl.tags || []
                )
              ),
            ]
              .slice(0, 3)
              .map((tag) => (
                <View key={tag} className="px-2 py-1 bg-gray-200 rounded">
                  <Text className="text-xs">{tag}</Text>
                </View>
              ))}
          </View>
          <Text className="text-sm text-gray-500">
            {t("battlePage.tags")}
          </Text>
        </View>
      </View>
    </View>
  );
};
