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

  const { query } = useList({
    resource: "battles",
  });

  const { data, isLoading, isError } = query;

  // Debug logging
  console.log('Arena Page - useList full data:', JSON.stringify(data, null, 2));
  console.log('Arena Page - data?.data:', data?.data);
  console.log('Arena Page - isLoading:', isLoading);
  console.log('Arena Page - isError:', isError);

  const battles = useMemo(() => {
    if (!data?.data) {
      console.log('Arena Page - No data, returning empty array');
      return [];
    }
    console.log('Arena Page - data.data type:', typeof data.data);
    console.log('Arena Page - data.data is array:', Array.isArray(data.data));
    if (Array.isArray(data.data)) {
      return data.data as ArenaBattle[];
    } else if (data.data && typeof data.data === 'object' && Array.isArray(data.data.data)) {
      // Handle nested data structure like { data: { data: [...] } }
      return data.data.data as ArenaBattle[];
    } else {
      console.log('Unexpected data structure for data.data:', data.data);
      return [];
    }
  }, [data?.data]);

  console.log('Arena Page - battles:', battles);
  console.log('Arena Page - battles is array:', Array.isArray(battles));

  const filteredBattles = useMemo(() => {
    if (!Array.isArray(battles)) {
      console.error('Arena Page - battles is not an array!', battles);
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
        <Text style={{ color: textColor }}>加载中...</Text>
      </View>
    );
  }

  // 添加错误状态显示
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor }}>
        <Text style={{ color: textColor }}>加载失败，请检查网络连接</Text>
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
            {t("arenaPage.foundBattles", { count: filteredBattles.length })} 场对战
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
