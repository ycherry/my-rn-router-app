import { useOne } from "@refinedev/core";
import { useLocalSearchParams } from "expo-router";
import React, { type FC } from "react";
import { Text, View } from "react-native";

export const BattleHeader: FC = () => {
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
  return (
    <View className="text-center mb-12">
      <View className="mb-6">
        <View className="flex items-center justify-center mb-4">
          <Text className="text-4xl font-black">
            {currentBattle.title}
          </Text>
        </View>

        <Text className="text-xl max-w-4xl mx-auto leading-relaxed text-muted-foreground">
          {currentBattle.description}
        </Text>
      </View>
    </View>
  );
};
