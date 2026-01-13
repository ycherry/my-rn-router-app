import { useThemeColor } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { useStore } from "zustand";
import { useArenaPageStore } from "./_store";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

export const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  const { t } = useTranslation();
  const store = useArenaPageStore();
  const selectedCategory = useStore(store, (state) => state.selectedCategory);
  const handleCategoryChange = useStore(
    store,
    (state) => state.handleCategoryChange
  );

  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'tint');

  return (
    <View>
      <View className="flex-row items-center gap-2 mb-3">
        <Ionicons name="code-slash" size={16} color={primaryColor} />
        <Text className="text-sm font-semibold" style={{ color: textColor }}>
          {t("arenaPage.categories")}
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategoryChange(category.id)}
            className={`flex-row items-center px-4 py-2 border border-gray-300 rounded-lg ${selectedCategory === category.id ? 'bg-blue-500' : ''}`}
            style={selectedCategory === category.id ? { backgroundColor: primaryColor } : {}}
          >
            <Text className="mr-2">{category.icon}</Text>
            <Text className="text-sm" style={{ color: selectedCategory === category.id ? 'white' : textColor }}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

