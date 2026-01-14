import React from "react";
import { View } from "react-native";

interface BattleBackgroundProps {
  battleAnimation: boolean;
}

export const BattleBackground: React.FC<BattleBackgroundProps> = ({
  battleAnimation,
}) => {
  return (
    <>
      <View className="absolute inset-0 bg-grid-pattern opacity-20" />
      <View className="absolute inset-0">
        <View className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <View className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <View className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-2xl" />
      </View>

      {battleAnimation && (
        <View className="absolute inset-0 pointer-events-none">
          <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <View className="w-32 h-32 border-2 border-cyan-500 rounded-full opacity-75" />
            <View className="absolute inset-0 w-32 h-32 border-2 border-purple-500 rounded-full opacity-50" />
          </View>
        </View>
      )}
    </>
  );
};
