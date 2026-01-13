import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export const UserAvatarMenu = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const handleLogout = () => {
    Alert.alert(
      t("userMenu.logoutConfirmTitle") || "Logout",
      t("userMenu.logoutConfirmMessage") || "Are you sure you want to logout?",
      [
        { text: t("cancel") || "Cancel", style: "cancel" },
        {
          text: t("userMenu.logout"),
          style: "destructive",
          onPress: () => {
            logout();
            setModalVisible(false);
          },
        },
      ]
    );
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleUserProfile = () => {
    // router.push("/user");
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.trigger}
      >
        {user.image ? (
          <Image
            style={styles.avatar}
            source={{ uri: user.image }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user.name.at(0)?.toUpperCase() ?? "-"}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.userInfo}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarTextSmall}>
                  {user.name.at(0)?.toUpperCase() ?? "-"}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={handleUserProfile}>
              <Ionicons name="person-circle" size={20} color="#333" />
              <Text style={styles.menuText}>{t("userMenu.profile")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out" size={20} color="#d32f2f" />
              <Text style={[styles.menuText, styles.logoutText]}>
                {t("userMenu.logout")}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    padding: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "80%",
    maxWidth: 300,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarTextSmall: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  logoutText: {
    color: "#d32f2f",
  },
});
