import type { ArenaBattle } from "@/lib/types";
import { Dimensions, View } from "react-native";
import { BattleCard } from "./BattleCard";

interface BattlesGridProps {
  battles: ArenaBattle[];
  onBattleClick: (battleId: number) => void;
}

export const BattlesGrid = ({ battles, onBattleClick }: BattlesGridProps) => {
  const handleBattleClick = (battleId: number) => {
    onBattleClick(battleId);
  };

  return (
    <View className="flex-row flex-wrap justify-center">
      {battles.map((battle) => (
        <BattleCard
          key={battle.id}
          battle={battle}
          onClick={handleBattleClick}
        />
      ))}
    </View>
  );
};

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2 - 12; // 2 columns with padding

