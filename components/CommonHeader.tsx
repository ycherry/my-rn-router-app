import { useAuth } from "@/hooks/useAuth";
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandDropdownMenu } from "./BrandDropdownMenu";
import { LanguageSelect } from "./LanguageSelect";
import { UserAvatarMenu } from "./UserAvatarMenu";

export const CommonHeader = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // const handleNavigateToSubmit = () => {
  //   router.push("/submit-battle");
  // };

  return (
    <View style={{ height: 64 + insets.top, position: 'absolute', width: '100%', top: 0, zIndex: 50, backgroundColor: 'rgba(255,255,255,0.7)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: insets.top + 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      {isAuthenticated ? (
        <BrandDropdownMenu />
      ) : (
        <Link href="/arena" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>
            {t("navigation.brand")}
          </Text>
        </Link>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <LanguageSelect />

        {isAuthenticated && (
          <TouchableOpacity
            // onPress={handleNavigateToSubmit}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12 }}
          >
            <MaterialIcons name="file-upload" size={16} color="currentColor" />
            <Text>{t("arenaPage.submitBattle")}</Text>
          </TouchableOpacity>
        )}

        {isAuthenticated ? (
          <UserAvatarMenu />
        ) : (
          <>
            <TouchableOpacity
              onPress={() => router.push('/login?redirect=/arena')}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: 'gray', borderRadius: 4 }}
            >
              <Text>{t("navigation.login")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={() => router.push('/register')}
              style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'blue', borderRadius: 4 }}
            >
              <Text style={{ color: 'white' }}>{t("navigation.register")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};
