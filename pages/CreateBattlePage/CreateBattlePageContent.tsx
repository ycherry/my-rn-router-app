import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useCreate } from '@refinedev/core';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';
import { useCreateBattlePageStore } from './_store';

export const CreateBattlePageContent = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const store = useCreateBattlePageStore();
  const {
    battle,
    loading,
    updateBattle,
    updateImplementation,
    addImplementation,
    removeImplementation,
    addPro,
    removePro,
    updatePro,
    addCon,
    removeCon,
    updateCon,
    setLoading,
    reset,
  } = useStore(store);

  const { mutate: createBattle } = useCreate();

  const categories = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'node.js', label: 'Node.js' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'folder', label: t('submitBattle.folder') },
  ];

  const handleCreateBattle = async () => {
    console.log('[CreateBattle] Current battle state:', battle);
    
    if (!battle.title.trim()) {
      Alert.alert(t('common.error'), t('createBattle.titleRequired'));
      return;
    }
    if (battle.implementations.length < 2) {
      Alert.alert(t('common.error'), t('createBattle.implementationsRequired'));
      return;
    }

    // 验证 implementations 数据
    const hasEmptyImplementation = battle.implementations.some(
      impl => !impl.title.trim() || !impl.description.trim() || !impl.code.trim() || !impl.author.trim()
    );
    if (hasEmptyImplementation) {
      Alert.alert(t('common.error'), t('createBattle.implementationFieldsRequired'));
      return;
    }

    setLoading(true);
    try {
      // 准备数据，过滤空的 pros/cons/tags
      const battleData = {
        title: battle.title,
        description: battle.description,
        category: battle.category,
        implementations: battle.implementations.map(impl => ({
          title: impl.title,
          description: impl.description,
          code: impl.code,
          author: impl.author,
          pros: impl.pros.filter(p => p.trim() !== ''),
          cons: impl.cons.filter(c => c.trim() !== ''),
          tags: impl.tags.filter(t => t.trim() !== ''),
        })),
      };

      console.log('[CreateBattle] Sending data:', battleData);

      createBattle(
        {
          resource: 'battles',
          values: battleData,
        },
        {
          onSuccess: () => {
            Alert.alert(t('common.success'), t('createBattle.createSuccess'), [
              {
                text: t('common.ok'),
                onPress: () => {
                  reset();
                  router.push('/(tabs)/arena');
                },
              },
            ]);
          },
          onError: (error) => {
            console.error('[CreateBattle] Error:', error);
            Alert.alert(t('common.error'), t('createBattle.createFailed'));
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('[CreateBattle] Unexpected error:', error);
      Alert.alert(t('common.error'), t('createBattle.createFailed'));
      setLoading(false);
    }
  };

  const handleUpdateTitle = (value: string) => updateBattle('title', value);
  const handleUpdateCategory = (value: string) => updateBattle('category', value);
  const handleUpdateDescription = (value: string) => updateBattle('description', value);
  const handleRemoveImplementation = (implIndex: number) => removeImplementation(implIndex);
  const handleUpdateImplTitle = (implIndex: number) => (value: string) =>
    updateImplementation(implIndex, 'title', value);
  const handleUpdateImplAuthor = (implIndex: number) => (value: string) =>
    updateImplementation(implIndex, 'author', value);
  const handleUpdateImplDescription = (implIndex: number) => (value: string) =>
    updateImplementation(implIndex, 'description', value);
  const handleUpdateImplCode = (implIndex: number) => (value: string) =>
    updateImplementation(implIndex, 'code', value);
  const handleUpdateImplTags = (implIndex: number) => (value: string) =>
    updateImplementation(
      implIndex,
      'tags',
      value.split(',').map((t) => t.trim())
    );
  const handleUpdatePro = (implIndex: number, proIndex: number) => (value: string) =>
    updatePro(implIndex, proIndex, value);
  const handleRemovePro = (implIndex: number, proIndex: number) =>
    removePro(implIndex, proIndex);
  const handleAddPro = (implIndex: number) => addPro(implIndex);
  const handleUpdateCon = (implIndex: number, conIndex: number) => (value: string) =>
    updateCon(implIndex, conIndex, value);
  const handleRemoveCon = (implIndex: number, conIndex: number) =>
    removeCon(implIndex, conIndex);
  const handleAddCon = (implIndex: number) => addCon(implIndex);
  const handleAddImplementation = () => addImplementation();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            {t('createBattle.title')}
          </Text>
          <Text className="text-base text-gray-600">
            {t('createBattle.subtitle')}
          </Text>
        </View>

        {/* Basic Info Card */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-cyan-600 mb-6">
            {t('submitBattle.basicInfo')}
          </Text>

          {/* Battle Title */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-cyan-500 mb-2">
              {t('submitBattle.battleTitle')}
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
              placeholder={t('submitBattle.battleTitlePlaceholder')}
              value={battle.title}
              onChangeText={handleUpdateTitle}
              editable={!loading}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Tech Stack Category */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-purple-500 mb-2">
              {t('submitBattle.techStack')}
            </Text>
            <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
              <Picker
                selectedValue={battle.category}
                onValueChange={handleUpdateCategory}
                enabled={!loading}
              >
                {categories.map((cat) => (
                  <Picker.Item
                    key={cat.value}
                    label={cat.label}
                    value={cat.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Battle Description */}
          <View className="mb-0">
            <Text className="text-sm font-semibold text-green-500 mb-2">
              {t('submitBattle.battleDescription')}
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white min-h-[100px]"
              placeholder={t('submitBattle.battleDescriptionPlaceholder')}
              value={battle.description}
              onChangeText={handleUpdateDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!loading}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Implementations */}
        {battle.implementations.map((impl, implIndex) => (
          <View key={implIndex} className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    implIndex === 0 ? 'bg-cyan-500' : 'bg-purple-500'
                  }`}
                >
                  <Text className="text-white font-bold text-lg">
                    {String.fromCharCode(65 + implIndex)}
                  </Text>
                </View>
                <Text className="ml-3 text-xl font-bold text-gray-900">
                  {t('submitBattle.implementation')} {String.fromCharCode(65 + implIndex)}
                </Text>
              </View>
              {battle.implementations.length > 2 && (
                <TouchableOpacity
                  onPress={() => handleRemoveImplementation(implIndex)}
                  className="p-2"
                >
                  <Ionicons name="trash-outline" size={24} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>

            {/* Implementation Title and Author */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-cyan-500 mb-2">
                {t('submitBattle.implementationTitle')}
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder={t('submitBattle.implementationTitlePlaceholder')}
                value={impl.title}
                onChangeText={handleUpdateImplTitle(implIndex)}
                editable={!loading}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-semibold text-purple-500 mb-2">
                {t('submitBattle.author')}
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white"
                placeholder={t('submitBattle.authorPlaceholder')}
                value={impl.author}
                onChangeText={handleUpdateImplAuthor(implIndex)}
                editable={!loading}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Implementation Description */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-green-500 mb-2">
                {t('submitBattle.implementationDescription')}
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white min-h-[80px]"
                placeholder={t('submitBattle.implementationDescriptionPlaceholder')}
                value={impl.description}
                onChangeText={handleUpdateImplDescription(implIndex)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Code Implementation */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-yellow-500 mb-2">
                {t('submitBattle.codeImplementation')}
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white min-h-[160px] font-mono"
                placeholder={t('submitBattle.codePlaceholder')}
                value={impl.code}
                onChangeText={handleUpdateImplCode(implIndex)}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                editable={!loading}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Advantages */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-green-500 mb-2">
                {t('submitBattle.advantages')}
              </Text>
              {impl.pros.map((pro, proIndex) => (
                <View key={proIndex} className="flex-row items-center mb-2">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    placeholder={t('submitBattle.advantagePlaceholder')}
                    value={pro}
                    onChangeText={handleUpdatePro(implIndex, proIndex)}
                    editable={!loading}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemovePro(implIndex, proIndex)}
                    disabled={impl.pros.length <= 1 || loading}
                    className="ml-2 p-2"
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color={impl.pros.length <= 1 ? '#9ca3af' : '#ef4444'}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => handleAddPro(implIndex)}
                disabled={loading}
                className="flex-row items-center mt-2 px-3 py-2 bg-green-50 rounded-lg"
              >
                <Ionicons name="add-circle-outline" size={20} color="#10b981" />
                <Text className="ml-2 text-green-600 font-semibold">
                  {t('submitBattle.addAdvantage')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Disadvantages */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-red-500 mb-2">
                {t('submitBattle.disadvantages')}
              </Text>
              {impl.cons.map((con, conIndex) => (
                <View key={conIndex} className="flex-row items-center mb-2">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    placeholder={t('submitBattle.disadvantagePlaceholder')}
                    value={con}
                    onChangeText={handleUpdateCon(implIndex, conIndex)}
                    editable={!loading}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveCon(implIndex, conIndex)}
                    disabled={impl.cons.length <= 1 || loading}
                    className="ml-2 p-2"
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color={impl.cons.length <= 1 ? '#9ca3af' : '#ef4444'}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => handleAddCon(implIndex)}
                disabled={loading}
                className="flex-row items-center mt-2 px-3 py-2 bg-red-50 rounded-lg"
              >
                <Ionicons name="add-circle-outline" size={20} color="#ef4444" />
                <Text className="ml-2 text-red-600 font-semibold">
                  {t('submitBattle.addDisadvantage')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tags */}
            <View className="mb-0">
              <Text className="text-sm font-semibold text-cyan-500 mb-2">
                {t('submitBattle.tags')}
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                placeholder={t('submitBattle.tagsPlaceholder')}
                value={impl.tags.join(', ')}
                onChangeText={handleUpdateImplTags(implIndex)}
                editable={!loading}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        ))}

        {/* Add More Implementations */}
        {battle.implementations.length < 4 && (
          <View className="bg-white rounded-2xl p-6 mb-6 border-2 border-dashed border-gray-300">
            <TouchableOpacity
              onPress={handleAddImplementation}
              disabled={loading}
              className="flex-row items-center justify-center py-2"
            >
              <Ionicons name="add-circle-outline" size={28} color="#06b6d4" />
              <Text className="ml-3 text-cyan-600 font-bold text-lg">
                {t('submitBattle.addMoreImplementations')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mb-8">
          <TouchableOpacity
            className={`py-4 px-6 rounded-lg items-center justify-center ${
              loading ? 'bg-gray-400' : 'bg-green-600'
            } shadow-lg mb-4`}
            onPress={handleCreateBattle}
            disabled={loading}
          >
            <View className="flex-row items-center">
              <Ionicons name="cloud-upload-outline" size={24} color="white" />
              <Text className="ml-2 text-white text-center text-lg font-bold">
                {loading ? t('createBattle.creating') : t('submitBattle.submitBattle')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-4 px-6 rounded-lg border-2 border-gray-300 items-center justify-center"
            onPress={() => router.back()}
            disabled={loading}
          >
            <View className="flex-row items-center">
              <Ionicons name="arrow-back-outline" size={24} color="#4b5563" />
              <Text className="ml-2 text-gray-700 text-center text-lg font-bold">
                {t('submitBattle.cancel')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
