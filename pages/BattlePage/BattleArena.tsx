import { ImplementationCard } from "@/components/ImplementationCard";
import type { CodeImplementation } from "@/lib/types";
import { useOne } from "@refinedev/core";
import { useLocalSearchParams } from "expo-router";
import { type FC } from "react";
import { View } from "react-native";

export const BattleArena: FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { query } = useOne({
    resource: "battles",
    id: id,
  });

  const { data: battleData } = query;
  const currentBattle = battleData?.data;

  return (
    <View className="flex-row flex-wrap gap-8 mb-8">
      {currentBattle?.implementations.map((implementation: CodeImplementation) => (
        <ImplementationCard
          key={implementation.id}
          implementation={implementation}
        />
      ))}
    </View>
  );
};
