import { Text } from '@/components/Themed';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';
import { useCreateBattlePageStore } from './_store';

export const CreateBattlePageContent = () => {
  const router = useRouter();
  const store = useCreateBattlePageStore();
  const {
    battleTitle,
    battleDescription,
    githubRepo,
    loading,
    setBattleTitle,
    setBattleDescription,
    setGithubRepo,
    setLoading,
    reset,
  } = useStore(store);

  const handleCreateBattle = async () => {
    if (!battleTitle.trim()) {
      Alert.alert('错误', '请输入战斗标题');
      return;
    }
    if (!githubRepo.trim()) {
      Alert.alert('错误', '请输入GitHub仓库地址');
      return;
    }

    setLoading(true);
    try {
      // TODO: 调用创建battle的API
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('成功', '战斗创建成功', [
        {
          text: '确定',
          onPress: () => {
            reset();
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '创建战斗失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        <Text className="text-2xl font-bold mb-5">创建战斗</Text>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">战斗标题</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="输入战斗标题"
            value={battleTitle}
            onChangeText={setBattleTitle}
            editable={!loading}
          />
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">战斗描述</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base min-h-[100px]"
            placeholder="输入战斗描述"
            value={battleDescription}
            onChangeText={setBattleDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">GitHub仓库</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 text-base"
            placeholder="例如: owner/repo"
            value={githubRepo}
            onChangeText={setGithubRepo}
            editable={!loading}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          className={`py-4 px-5 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
          onPress={handleCreateBattle}
          disabled={loading}
        >
          <Text className="text-white text-center text-base font-bold">
            {loading ? '创建中...' : '创建战斗'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-3 py-4 px-5 rounded-lg border border-gray-300"
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text className="text-gray-700 text-center text-base font-bold">取消</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
