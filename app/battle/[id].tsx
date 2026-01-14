import { BattlePage } from '@/pages/BattlePage';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function Battle() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    navigation.setOptions({
      title: `battle/${id}`,
    });
  }, [navigation, id]);

  return <BattlePage />;
}