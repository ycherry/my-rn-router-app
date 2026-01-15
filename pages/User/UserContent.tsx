import { Text } from '@/components/Themed';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useStore } from 'zustand';
import { useUserStore } from './_store';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, showArrow = true }) => (
  <TouchableOpacity
    className="flex-row items-center justify-between bg-white px-5 py-4 border-b border-gray-100"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="flex-row items-center">
      <Ionicons name={icon} size={24} color="#3b82f6" />
      <Text className="ml-4 text-base">{title}</Text>
    </View>
    {showArrow && <Ionicons name="chevron-forward" size={20} color="#9ca3af" />}
  </TouchableOpacity>
);

export const UserContent = () => {
  const router = useRouter();
  const store = useUserStore();
  const { userName, userEmail, loading } = useStore(store);
  const { logout, user, loading: authLoading } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      store.getState().setUserName(user.name || '');
      store.getState().setUserEmail(user.email || '');
    }
    store.getState().setLoading(authLoading);
  }, [user, authLoading, store]);

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text>{t('submitBattle.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* 用户信息头部 */}
      <View className="bg-white pt-16 pb-8 px-5 mb-3">
        <View className="flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {userName ? userName[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-xl font-bold mb-1">{userName || t('userPage.unset')}</Text>
            <Text className="text-gray-500 text-sm">{userEmail || t('userPage.unset')}</Text>
          </View>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className="bg-white mb-3">
        <MenuItem
          icon="add-circle-outline"
          title={t('userPage.createBattle')}
          onPress={() => router.push('/create-battle')}
        />
        <MenuItem
          icon="settings-outline"
          title={t('userPage.menuPreferences')}
          onPress={() => router.push('/preferences')}
        />
        <MenuItem
          icon="time-outline"
          title={t('userPage.menuVotingHistory')}
          onPress={() => router.push('/voting-history')}
        />
        <MenuItem
          icon="folder-outline"
          title={t('userPage.menuMyProjects')}
          onPress={() => router.push('/my-projects')}
        />
      </View>

      {/* 退出登录按钮 */}
      <View className="px-5 mt-5">
        <TouchableOpacity
          className="py-4 px-5 bg-white rounded-lg border border-gray-200"
          onPress={logout}
          activeOpacity={0.7}
        >
          <Text className="text-red-500 text-center text-base font-semibold">{t('userMenu.logout')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};