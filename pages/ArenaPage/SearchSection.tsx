import { useThemeColor } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { TextInput, View } from "react-native";
import { useStore } from "zustand";
import { useArenaPageStore } from "./_store";

export const SearchSection = () => {
  const { t } = useTranslation();
  const store = useArenaPageStore();
  const searchQuery = useStore(store, (state) => state.searchQuery);
  const handleSearchChange = useStore(
    store,
    (state) => state.handleSearchChange
  );

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <View className="relative mb-6" style={{ backgroundColor }}>
      <Ionicons name="search" size={20} color={textColor} className="absolute left-4 top-1/2 -translate-y-2.5" />
      <TextInput
        placeholder={t("arenaPage.searchBattles")}
        value={searchQuery}
        onChangeText={handleSearchChange}
        className="w-full pl-12 py-3 border border-gray-300 rounded-lg text-base"
        style={{ color: textColor }}
        placeholderTextColor={textColor}
      />
    </View>
  );
};

