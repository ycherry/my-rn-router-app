import { useAuth } from "@/hooks/useAuth";
import type { CodeImplementation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AIPromptGenerator, type AIPrompt } from "@/utils/aiPromptGenerator";
import { Ionicons } from "@expo/vector-icons";
import { useCreate, useInvalidate, useList, useOne } from "@refinedev/core";
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

  const { query } = useOne({
    resource: "battles",
    id: battleId,
  });

  const { data, isLoading, isError } = query;

  const currentBattle = data?.data;

  const { result: userVotesResult } = useList({
    resource: "votes",
    filters: user ? [{ field: "userId", operator: "eq", value: user.id }] : [],
  });

  const userVotes = userVotesResult?.data?.reduce((acc: Record<string, boolean>, vote: any) => {
    acc[vote.implementationId.toString()] = true;
    return acc;
  }, {}) || {};

  const { mutate: voteForImplementation } = useCreate();

  const invalidate = useInvalidate();

  const totalVotes =
    currentBattle?.implementations?.reduce((sum: number, impl: any) => sum + impl.votes, 0) ||
    0;
  const hasVoted = currentBattle?.implementations?.some((impl: any) => userVotes[impl.id.toString()]) || false;
  const userVoteId = currentBattle?.implementations?.find((impl: any) => userVotes[impl.id.toString()])?.id.toString();
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
      voteForImplementation(
        {
          resource: "votes",
          values: {
            implementationId: implementation.id,
          },
        },
        {
          onSuccess: () => {
            // 刷新投票列表和战斗详情
            invalidate({
              resource: "votes",
              invalidates: ["list"],
            });
            invalidate({
              resource: "battles",
              id: battleId,
              invalidates: ["detail"],
            });
          },
          onError: (error) => {
            console.error("Vote error:", error);
          },
        }
      );
    }
  };
  const handleClose = () => setShowAIPrompt(false);

  return (
    <View className={cn("relative p-2", isUserVote && "border-primary border-2")}>
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

      <View className="p-4 mb-2 bg-gray-100 rounded">
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

      <View className="flex flex-row space-x-3 mt-2">
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
        >
          <Ionicons name="bulb" size={16} color="currentColor" />
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