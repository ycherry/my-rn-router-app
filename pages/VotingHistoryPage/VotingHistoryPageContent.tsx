import { Text } from '@/components/Themed';
import { useList } from '@refinedev/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { useVotingHistoryPageStore } from './_store';

export const VotingHistoryPageContent = () => {
  const store = useVotingHistoryPageStore();
  const { t } = useTranslation();

  // 使用 useList 获取投票历史数据
  const { query } = useList({
    resource: "votes",
  });

  const { data, isLoading, isError, error, refetch } = query;

  console.log('Voting History Page - useList full data:', JSON.stringify(data, null, 2));
  console.log('Voting History Page - error:', error);

  const votes = data?.data || [];

  const renderVoteItem = ({ item }: { item: any }) => {
    const votedAt = new Date(item.votedAt).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
        <Text className="text-lg font-bold mb-2">{item.battle.title}</Text>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600">投票给:</Text>
          <Text className="font-semibold">{item.implementation.title}</Text>
        </View>
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-gray-600">时间:</Text>
          <Text className="text-sm text-gray-500">{votedAt}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-600">票数:</Text>
          <Text className="font-semibold text-blue-600">{item.implementation.votes}</Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-gray-500 text-base">
        {isLoading ? '加载中...' : '暂无投票记录'}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-5 pb-0">
        <Text className="text-2xl font-bold mb-5">投票历史</Text>
      </View>
      <FlatList
        data={votes}
        renderItem={renderVoteItem}
        keyExtractor={(item) => item.voteId.toString()}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        ListEmptyComponent={renderEmpty}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </View>
  );
};
