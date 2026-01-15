import { useAuth } from "@/hooks/useAuth";
import { useOne } from "@refinedev/core";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { BattleArena } from "./BattleArena";
import { BattleError } from "./BattleError";
import { BattleHeader } from "./BattleHeader";
import { BattleLoading } from "./BattleLoading";

export const BattlePageContent = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const { query } = useOne({
    resource: "battles",
    id: id,
  });

  const { data, isLoading, isError } = query;

  const currentBattle = data?.data;

  if (isLoading) {
    return <BattleLoading />;
  }

  if (isError || !currentBattle) {
    return <BattleError />;
  }

  return (
    <ScrollView className="min-h-screen bg-background text-foreground">
      <View className="relative z-10 container mx-auto px-6 py-8">
        <BattleHeader />

        <BattleArena />

        {/* <BattleStatistics /> */}
      </View>
    </ScrollView>
  );
};
