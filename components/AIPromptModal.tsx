import type { CodeImplementation } from "@/lib/types";
import { type AIPrompt } from "@/utils/aiPromptGenerator";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: AIPrompt | null;
  implementation: CodeImplementation;
  battleTitle: string;
  category: string;
}

const AIPromptModal = ({
  isOpen,
  onClose,
  prompt,
  implementation,
  battleTitle,
  category,
}: AIPromptModalProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const { t } = useTranslation();

  if (!isOpen || !prompt) return null;

  const handleClose = onClose;

  const handleCopy = () => {
    Alert.alert("Copy", "Copy functionality not implemented in RN yet.");
  };

  const handleDownload = () => {
    Alert.alert("Download", "Download functionality not implemented.");
  };

  const handleShare = () => {
    Alert.alert("Share", "Share functionality not implemented.");
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedPrompt(prompt.prompt);
    }
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <Modal visible={isOpen} animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
        <View className="bg-white dark:bg-gray-900 rounded-lg p-6 w-11/12 max-h-5/6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">{t("aiPromptModal.title")}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            <View className="mb-4">
              <Text className="text-lg font-semibold mb-2">{implementation.title}</Text>
              <Text className="text-sm text-gray-600">{battleTitle} - {category}</Text>
            </View>

            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold">{t("aiPromptModal.prompt")}</Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity onPress={handleEdit}>
                    <Ionicons name="create" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCopy}>
                    <Ionicons name="copy" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDownload}>
                    <Ionicons name="download" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleShare}>
                    <Ionicons name="share" size={16} />
                  </TouchableOpacity>
                </View>
              </View>

              {isEditing ? (
                <TextInput
                  multiline
                  value={editedPrompt}
                  onChangeText={setEditedPrompt}
                  className="border border-gray-300 rounded p-2 min-h-40"
                />
              ) : (
                <ScrollView className="border border-gray-300 rounded p-2 min-h-40">
                  <Text>{prompt.prompt}</Text>
                </ScrollView>
              )}
            </View>

            {isEditing && (
              <View className="flex-row justify-end space-x-2">
                <TouchableOpacity onPress={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">
                  <Text>{t("cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} className="bg-blue-500 px-4 py-2 rounded">
                  <Text className="text-white">{t("save")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AIPromptModal;
