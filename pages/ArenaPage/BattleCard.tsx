import { useThemeColor } from "@/components/Themed";
import type { ArenaBattle } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

interface BattleCardProps {
  battle: ArenaBattle;
  onClick: (battleId: number) => void;
}

export const BattleCard = ({ battle, onClick }: BattleCardProps) => {
  const { t } = useTranslation();
  const handleClick = () => {
    onClick(battle.id);
  };

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'tint');

  return (
    <TouchableOpacity
      onPress={handleClick}
      className="w-80 p-6 mb-6 border border-gray-300 rounded-lg shadow-sm mx-2"
      style={{ backgroundColor }}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View className="mb-4">
        <View>
          <Text className="text-xl font-bold mb-2" style={{ color: textColor }}>
            {battle.title}
          </Text>
          <Text className="text-sm leading-5" style={{ color: textColor }}>
            {battle.description}
          </Text>
        </View>
      </View>

      {/* Meta */}
      <View className="flex-row gap-2 mb-4">
        <View className="bg-gray-100 px-2 py-1 rounded">
          <Text className="text-xs">{battle.category}</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row justify-between pt-4 border-t border-gray-300">
        <View className="flex-row items-center gap-1">
          <Ionicons name="code-slash" size={16} color={textColor} />
          <Text className="text-sm" style={{ color: textColor }}>
            {battle.implementations.length} {t("arenaPage.implementations")}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="trophy" size={16} color={textColor} />
          <Text className="text-sm" style={{ color: textColor }}>
            {battle.totalVotes} {t("arenaPage.votes")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

