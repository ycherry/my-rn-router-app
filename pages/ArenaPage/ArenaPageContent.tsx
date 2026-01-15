import { useThemeColor } from "@/components/Themed";
import type { ArenaBattle } from "@/lib/types";
import { useList } from "@refinedev/core";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useStore } from "zustand";
import { useArenaPageStore } from "./_store";
import { BattlesGrid } from "./BattlesGrid";
import { CategoriesSection } from "./CategoriesSection";
import { EmptyState } from "./EmptyState";
import { SearchSection } from "./SearchSection";

export const ArenaPageContent = () => {
  const store = useArenaPageStore();
  const router = useRouter();
  const { t } = useTranslation();
  const searchQuery = useStore(store, (state) => state.searchQuery);
  const selectedCategory = useStore(store, (state) => state.selectedCategory);

  const categories = [
    { id: "all", label: t("arenaPage.all"), icon: "🎯" },
    { id: "javascript", label: t("arenaPage.javascript"), icon: "🟨" },
    { id: "typescript", label: t("arenaPage.typescript"), icon: "🔷" },
    { id: "python", label: t("arenaPage.python"), icon: "🐍" },
    { id: "java", label: t("arenaPage.java"), icon: "☕" },
    { id: "rust", label: t("arenaPage.rust"), icon: "🦀" },
    { id: "go", label: t("arenaPage.go"), icon: "🔵" },
  ];

  const { query } = useList<ArenaBattle>({
    resource: "battles",
  });

  const { data, isLoading, isError } = query;

  const battles = useMemo(() => {
    if (!data?.data) {
      console.log('Arena Page - No data, returning empty array');
      return [];
    }
    const rawData = data.data;
    if (Array.isArray(rawData)) {
      return rawData as ArenaBattle[];
    } else if (rawData && typeof rawData === 'object' && 'data' in rawData && Array.isArray(rawData.data)) {
      // Handle nested data structure like { data: { data: [...] } }
      return rawData.data as unknown as ArenaBattle[];
    } else {
      console.log('Unexpected data structure for rawData:', rawData);
      return [];
    }
  }, [data?.data]);

  console.log('Arena Page - battles:', battles);

  const filteredBattles = useMemo(() => {
    if (!Array.isArray(battles)) {
      return [];
    }
    return battles.filter((battle) => {
      const matchesSearch =
        searchQuery === "" ||
        battle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        battle.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || battle.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [battles, searchQuery, selectedCategory]);

  const handleBattleClick = (battleId: number) => {
    router.push(`/battle/${battleId}`);
  };

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // 添加加载状态显示
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor }}>
        <Text style={{ color: textColor }}>{t("arenaPage.loading")}</Text>
      </View>
    );
  }

  // 添加错误状态显示
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor }}>
        <Text style={{ color: textColor }}>{t("arenaPage.loadingFailed")}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" style={{ backgroundColor }}>
      <View className="items-center justify-center py-5 pt-14">
        <Text className="text-4xl font-black" style={{ color: textColor }}>
          {t("arenaPage.arena")}
        </Text>
      </View>

      <View className="px-6 py-4">
        <SearchSection />
        <CategoriesSection categories={categories} />
      </View>

      <View className="max-w-[1200px] self-center w-full px-6 py-8">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-sm" style={{ color: textColor }}>
            {t("arenaPage.foundBattles", { count: filteredBattles.length })}
          </Text>
        </View>

        {filteredBattles.length === 0 ? (
          <EmptyState />
        ) : (
          <BattlesGrid battles={filteredBattles} onBattleClick={handleBattleClick} />
        )}
      </View>
    </ScrollView>
  );
};
