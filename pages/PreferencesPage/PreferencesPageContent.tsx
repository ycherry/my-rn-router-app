import { Text } from '@/components/Themed';
import React from 'react';
import { Alert, ScrollView, Switch, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';
import { usePreferencesPageStore } from './_store';

export const PreferencesPageContent = () => {
  const store = usePreferencesPageStore();
  const {
    language,
    theme,
    notifications,
    loading,
    setLanguage,
    setTheme,
    setNotifications,
    setLoading,
  } = useStore(store);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: 调用保存偏好设置的API
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('成功', '偏好设置已保存');
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-5">
        <Text className="text-2xl font-bold mb-5">偏好设置</Text>

        {/* 语言设置 */}
        <View className="bg-white rounded-lg mb-3 p-4">
          <Text className="text-base font-semibold mb-3">语言</Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 mr-2 rounded-lg border ${
                language === 'zh' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
              }`}
              onPress={() => setLanguage('zh')}
            >
              <Text className={`text-center ${language === 'zh' ? 'text-white' : 'text-gray-700'}`}>
                中文
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                language === 'en' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
              }`}
              onPress={() => setLanguage('en')}
            >
              <Text className={`text-center ${language === 'en' ? 'text-white' : 'text-gray-700'}`}>
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 主题设置 */}
        <View className="bg-white rounded-lg mb-3 p-4">
          <Text className="text-base font-semibold mb-3">主题</Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 mr-2 rounded-lg border ${
                theme === 'light' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
              }`}
              onPress={() => setTheme('light')}
            >
              <Text className={`text-center ${theme === 'light' ? 'text-white' : 'text-gray-700'}`}>
                浅色
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-lg border ${
                theme === 'dark' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
              }`}
              onPress={() => setTheme('dark')}
            >
              <Text className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                深色
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 通知设置 */}
        <View className="bg-white rounded-lg mb-5 p-4 flex-row justify-between items-center">
          <Text className="text-base font-semibold">推送通知</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications ? '#3b82f6' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          className={`py-4 px-5 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
          onPress={handleSave}
          disabled={loading}
        >
          <Text className="text-white text-center text-base font-bold">
            {loading ? '保存中...' : '保存设置'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
