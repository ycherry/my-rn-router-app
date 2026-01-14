import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export const BattleLoading = () => {
  return (
    <View className="min-h-screen bg-background container mx-auto px-6 py-8 space-y-8">
      <View className="flex flex-col space-y-4">
        <View className="h-12 w-3/4 mx-auto bg-gray-300 rounded" />
        <View className="h-4 w-1/2 mx-auto bg-gray-300 rounded" />
      </View>
      <View className="p-6 border border-gray-300 rounded">
        <View className="flex-row flex-wrap gap-4">
          <View className="h-16 flex-1 bg-gray-300 rounded" />
          <View className="h-16 flex-1 bg-gray-300 rounded" />
          <View className="h-16 flex-1 bg-gray-300 rounded" />
          <View className="h-16 flex-1 bg-gray-300 rounded" />
        </View>
      </View>
      <View className="flex-row flex-wrap gap-8">
        <View className="h-96 flex-1 bg-gray-300 rounded" />
        <View className="h-96 flex-1 bg-gray-300 rounded" />
      </View>
      <ActivityIndicator size="large" />
      <Text>加载中...</Text>
    </View>
  );
};
