import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { FlatList, Linking, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';
import { useMyProjectsPageStore } from './_store';

export const MyProjectsPageContent = () => {
  const store = useMyProjectsPageStore();
  const { projects, loading, setProjects, setLoading } = useStore(store);

  const loadProjects = async () => {
    setLoading(true);
    try {
      // TODO: 调用获取项目列表的API
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 模拟数据
      const mockProjects = [
        {
          id: '1',
          name: 'my-rn-router-app',
          description: 'React Native 路由应用',
          url: 'https://github.com/username/my-rn-router-app',
          stars: 42,
          language: 'TypeScript',
        },
        {
          id: '2',
          name: 'awesome-project',
          description: '一个很棒的开源项目',
          url: 'https://github.com/username/awesome-project',
          stars: 128,
          language: 'JavaScript',
        },
        {
          id: '3',
          name: 'react-components',
          description: 'React组件库',
          url: 'https://github.com/username/react-components',
          stars: 256,
          language: 'TypeScript',
        },
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('加载项目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenProject = (url: string) => {
    Linking.openURL(url).catch(err => console.error('无法打开链接:', err));
  };

  const renderProjectItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white rounded-lg p-4 mb-3 border border-gray-200"
      onPress={() => handleOpenProject(item.url)}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-bold flex-1">{item.name}</Text>
        <View className="flex-row items-center ml-2">
          <Ionicons name="star" size={16} color="#f59e0b" />
          <Text className="ml-1 text-gray-600">{item.stars}</Text>
        </View>
      </View>
      <Text className="text-gray-600 mb-2" numberOfLines={2}>
        {item.description}
      </Text>
      <View className="flex-row items-center">
        <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
        <Text className="text-sm text-gray-500">{item.language}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Ionicons name="folder-open-outline" size={64} color="#9ca3af" />
      <Text className="text-gray-500 text-base mt-4">暂无项目</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-5 pb-0">
        <Text className="text-2xl font-bold mb-5">我的项目</Text>
      </View>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 0 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadProjects}
            colors={['#3b82f6']}
          />
        }
      />
    </View>
  );
};
