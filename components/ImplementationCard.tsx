import { useAuth } from "@/hooks/useAuth";
import type { CodeImplementation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AIPromptGenerator, type AIPrompt } from "@/utils/aiPromptGenerator";
import { Ionicons } from "@expo/vector-icons";
import { useCreate, useList, useOne } from "@refinedev/core";
import { useLocalSearchParams } from "expo-router";
import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AIPromptModal from "./AIPromptModal";

interface ImplementationCardProps {
  implementation: CodeImplementation;
}

export const ImplementationCard: FC<ImplementationCardProps> = ({
  implementation,
}) => {
  const { id: battleId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data: battleData } = useOne({
    resource: "battles",
    id: battleId,
  });

  const currentBattle = battleData?.data;

  const { data: userVotesData } = useList({
    resource: "votes",
    filters: user ? [{ field: "userId", operator: "eq", value: user.id }] : [],
  });

  const userVotes = userVotesData?.data?.reduce((acc: Record<string, string>, vote: any) => {
    acc[vote.battleId] = vote.implementationId.toString();
    return acc;
  }, {}) || {};

  const { mutate: voteForImplementation } = useCreate();

  const totalVotes =
    currentBattle?.implementations?.reduce((sum: number, impl: any) => sum + impl.votes, 0) ||
    0;
  const hasVoted = battleId ? userVotes[battleId] !== undefined : false;
  const userVoteId = battleId ? userVotes[battleId] : undefined;
  const battleTitle = currentBattle?.title || "";
  const category = currentBattle?.category || "";

  const votePercentage =
    totalVotes > 0 ? (implementation.votes / totalVotes) * 100 : 0;
  const isUserVote = userVoteId === implementation.id.toString();
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<AIPrompt | null>(null);

  const handleGeneratePrompt = () => {
    const prompt = AIPromptGenerator.generatePrompt(implementation, category);
    setAiPrompt(prompt);
    setShowAIPrompt(true);
  };

  const handleVote = () => {
    if (battleId && !hasVoted && user) {
      voteForImplementation({
        resource: "votes",
        values: {
          userId: user.id,
          implementationId: implementation.id,
        },
      });
    }
  };
  const handleClose = () => setShowAIPrompt(false);

  return (
    <View className={cn("relative p-6", isUserVote && "border-primary border-2")}>
      <View className="mb-4">
        <View className="flex items-start justify-between mb-3">
          <View className="flex-1">
            <Text
              className={cn(
                "text-xl font-bold mb-2",
                isUserVote && "text-primary"
              )}
            >
              {implementation.title}
            </Text>
          </View>
        </View>
      </View>

      <View className="p-4 mb-4 bg-gray-100 rounded">
        <View className="flex items-center justify-between mb-2">
          <View className="flex items-center space-x-2 text-primary">
            <Ionicons name="code" size={16} color="currentColor" />
            <Text className="text-sm font-semibold">
              {t("implementationCard.codeImplementation")}
            </Text>
          </View>
          <View className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        </View>

        <ScrollView className="max-h-40">
          <Text className="text-xs text-primary font-mono leading-relaxed">
            {implementation.code}
          </Text>
        </ScrollView>
      </View>

      {totalVotes > 0 && (
        <View className="mb-4">
          <View className="flex justify-between text-xs mb-2">
            <Text>{t("implementationCard.supportRate")}</Text>
            <Text className="font-bold">{votePercentage.toFixed(1)}%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded">
            <View
              className="h-2 bg-primary rounded"
              style={{ width: `${votePercentage}%` }}
            />
          </View>
        </View>
      )}

      <View className="flex flex-row space-x-3 mt-4">
        {/* 主要投票按钮 */}
        <TouchableOpacity
          onPress={handleVote}
          disabled={hasVoted}
          className={cn(
            "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded",
            hasVoted ? "bg-gray-300" : "bg-blue-500"
          )}
        >
          <Ionicons name="thumbs-up" size={16} color="white" />
          <Text className="text-white">
            {hasVoted
              ? t("implementationCard.voted")
              : t("implementationCard.voteSupport")}
          </Text>
        </TouchableOpacity>

        {/* AI提示词按钮 - 辅助功能 */}
        <TouchableOpacity
          onPress={handleGeneratePrompt}
          className="flex items-center space-x-2 py-2 px-4 rounded border border-gray-300"
          title={t("implementationCard.getAIPrompt")}
        >
          <Ionicons name="robot" size={16} color="currentColor" />
          <Text>{t("implementationCard.prompt")}</Text>
        </TouchableOpacity>
      </View>

      <AIPromptModal
        isOpen={showAIPrompt}
        onClose={handleClose}
        prompt={aiPrompt}
        implementation={implementation}
        battleTitle={battleTitle}
        category={category}
      />
    </View>
  );
};