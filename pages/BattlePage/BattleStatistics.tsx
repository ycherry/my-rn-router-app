import type { CodeImplementation } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { useOne } from "@refinedev/core";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export const BattleStatistics: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { query } = useOne({
    resource: "battles",
    id: id,
  });

  const { data: battleData } = query;
  const currentBattle = battleData?.data;

  if (!currentBattle) {
    return null;
  }

  const leadingImplementation = currentBattle.implementations.reduce(
    (prev: CodeImplementation, current: CodeImplementation) =>
      prev.votes > current.votes ? prev : current
  );

  return (
    <View className="p-6 mb-8 border border-gray-300 rounded">
      <Text className="text-2xl font-bold text-center mb-6">
        {t("battlePage.battleStatistics")}
      </Text>

      <View className="flex-row flex-wrap gap-6">
        {currentBattle.implementations.map(
          (implementation: CodeImplementation, index: number) => {
            const percentage =
              currentBattle.totalVotes > 0
                ? (implementation.votes / currentBattle.totalVotes) * 100
                : 0;
            const isLeading =
              implementation.votes === leadingImplementation.votes;

            return (
              <View key={implementation.id} className="p-4 border border-gray-300 rounded flex-1">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="font-bold">{implementation.title}</Text>
                  {isLeading && <Ionicons name="trophy" size={20} color="gold" />}
                </View>

                <View className="mb-3">
                  <View className="flex-row justify-between text-sm mb-1">
                    <Text>{t("battlePage.supportRate")}</Text>
                    <Text>{percentage.toFixed(1)}%</Text>
                  </View>
                  <View className="h-3 bg-gray-200 rounded">
                    <View
                      className={`h-full rounded ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="people" size={16} color="gray" />
                    <Text className="ml-1">
                      {implementation.votes} {t("battlePage.votes")}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="gray" />
                    <Text className="ml-1">
                      {t("battlePage.author")} {implementation.author}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }
        )}
      </View>
    </View>
  );
};
