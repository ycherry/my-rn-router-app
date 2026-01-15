import React, { type FormEvent, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand";
import {
  ArrowLeft,
  Upload,
  Code,
  FileText,
  Plus,
  Trash2,
  Settings,
  Code2,
  GitBranch,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useSubmitBattleStore } from "./_store";
import { useTRPC } from "@/integrations/trpc/react";
import { useAuth } from "../../hooks/useAuth";
import { SubmitBattlePreview } from "./SubmitBattlePreview";
import { useTranslation } from "react-i18next";
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@code-arena/ui";

export const SubmitBattlePageContent = () => {
  const navigate = useNavigate();
  const trpc = useTRPC();
  const store = useSubmitBattleStore();
  const createBattleMutation = useMutation(
    trpc.battles.create.mutationOptions()
  );
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();

  const {
    battle,
    previewMode,
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
    resetBattle,
  } = useStore(store);

  // 检查用户认证状态
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({
        to: "/login",
        search: { redirect: globalThis.location.pathname },
      });
    }
  }, [isAuthenticated, loading, navigate]);

  const categories = [
    { value: "javascript", label: "JavaScript", icon: Code },
    { value: "react", label: "React", icon: Code2 },
    { value: "vue", label: "Vue", icon: FileText },
    { value: "node.js", label: "Node.js", icon: GitBranch },
    { value: "typescript", label: "TypeScript", icon: Settings },
    { value: "文件夹", label: t("submitBattle.folder"), icon: FileText },
  ];

  const submitBattle = () => {
    createBattleMutation.mutate(
      {
        title: battle.title,
        description: battle.description,
        category: battle.category,
        implementations: battle.implementations.map((impl) => ({
          title: impl.title,
          description: impl.description,
          code: impl.code,
          author: impl.author,
          pros: impl.pros.filter((p) => p.trim()),
          cons: impl.cons.filter((c) => c.trim()),
          tags: impl.tags.filter((t) => t.trim()),
        })),
      },
      {
        onSuccess: () => {
          alert(t("submitBattle.submitSuccess"));
          resetBattle();
          navigate({ to: "/arena" });
        },
        onError: (error) => {
          alert(`${t("submitBattle.submitFailed")}${error.message}`);
        },
      }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitBattle();
  };

  const handleNavigateArena = () => navigate({ to: "/arena" });
  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateBattle("title", e.target.value);
  const handleUpdateCategory = (value: string) =>
    updateBattle("category", value);
  const handleUpdateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    updateBattle("description", e.target.value);
  const handleRemoveImplementation = (implIndex: number) =>
    removeImplementation(implIndex);
  const handleUpdateImplTitle =
    (implIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
      updateImplementation(implIndex, "title", e.target.value);
  const handleUpdateImplAuthor =
    (implIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
      updateImplementation(implIndex, "author", e.target.value);
  const handleUpdateImplDescription =
    (implIndex: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      updateImplementation(implIndex, "description", e.target.value);
  const handleUpdateImplCode =
    (implIndex: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      updateImplementation(implIndex, "code", e.target.value);
  const handleUpdateImplTags =
    (implIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) =>
      updateImplementation(
        implIndex,
        "tags",
        e.target.value.split(",").map((t) => t.trim())
      );
  const handleUpdatePro =
    (implIndex: number, proIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      updatePro(implIndex, proIndex, e.target.value);
  const handleRemovePro = (implIndex: number, proIndex: number) =>
    removePro(implIndex, proIndex);
  const handleAddPro = (implIndex: number) => addPro(implIndex);
  const handleUpdateCon =
    (implIndex: number, conIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      updateCon(implIndex, conIndex, e.target.value);
  const handleRemoveCon = (implIndex: number, conIndex: number) =>
    removeCon(implIndex, conIndex);
  const handleAddCon = (implIndex: number) => addCon(implIndex);
  const handleAddImplementation = () => addImplementation();

  if (previewMode) {
    return <SubmitBattlePreview />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative z-10 container mx-auto px-6 py-8 pt-30">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <Card className="p-6 mb-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 flex items-center space-x-2">
              <Code2 className="w-6 h-6" />
              <span>{t("submitBattle.basicInfo")}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                  {t("submitBattle.battleTitle")}
                </label>
                <Input
                  type="text"
                  value={battle.title}
                  onChange={handleUpdateTitle}
                  className="w-full px-4 py-3"
                  placeholder={t("submitBattle.battleTitlePlaceholder")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-400 mb-2">
                  {t("submitBattle.techStack")}
                </label>
                <Select
                  value={battle.category}
                  onValueChange={handleUpdateCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("submitBattle.techStack")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-green-400 mb-2">
                {t("submitBattle.battleDescription")}
              </label>
              <Textarea
                value={battle.description}
                onChange={handleUpdateDescription}
                className="h-24 resize-none"
                placeholder={t("submitBattle.battleDescriptionPlaceholder")}
                required
              />
            </div>
          </Card>

          {battle.implementations.map((impl, implIndex) => (
            <Card key={implIndex} className="p-6 mb-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center space-x-2 text-foreground">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      implIndex === 0
                        ? "bg-linear-to-r from-cyan-500 to-blue-600"
                        : "bg-linear-to-r from-purple-500 to-pink-600"
                    }`}
                  >
                    {String.fromCodePoint(65 + implIndex)}
                  </div>
                  <span>
                    {t("submitBattle.implementation")}{" "}
                    {String.fromCodePoint(65 + implIndex)}
                  </span>
                </h3>
                {battle.implementations.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveImplementation(implIndex)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-cyan-400 mb-2">
                    {t("submitBattle.implementationTitle")}
                  </label>
                  <Input
                    type="text"
                    value={impl.title}
                    onChange={handleUpdateImplTitle(implIndex)}
                    className="w-full px-4 py-3"
                    placeholder={t(
                      "submitBattle.implementationTitlePlaceholder"
                    )}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-400 mb-2">
                    {t("submitBattle.author")}
                  </label>
                  <Input
                    type="text"
                    value={impl.author}
                    onChange={handleUpdateImplAuthor(implIndex)}
                    className="w-full px-4 py-3"
                    placeholder={t("submitBattle.authorPlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-green-400 mb-2">
                  {t("submitBattle.implementationDescription")}
                </label>
                <Textarea
                  value={impl.description}
                  onChange={handleUpdateImplDescription(implIndex)}
                  className="h-20 resize-none"
                  placeholder={t(
                    "submitBattle.implementationDescriptionPlaceholder"
                  )}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-yellow-400 mb-2">
                  {t("submitBattle.codeImplementation")}
                </label>
                <Textarea
                  value={impl.code}
                  onChange={handleUpdateImplCode(implIndex)}
                  className="h-40 resize-none font-mono text-sm"
                  placeholder={t("submitBattle.codePlaceholder")}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-green-400 mb-2">
                  {t("submitBattle.advantages")}
                </label>
                {impl.pros.map((pro, proIndex) => (
                  <div
                    key={proIndex}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Input
                      type="text"
                      value={pro}
                      onChange={handleUpdatePro(implIndex, proIndex)}
                      className="flex-1 px-3 py-2 text-sm"
                      placeholder={t("submitBattle.advantagePlaceholder")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePro(implIndex, proIndex)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      disabled={impl.pros.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAddPro(implIndex)}
                  className="mt-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("submitBattle.addAdvantage")}</span>
                </Button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-red-400 mb-2">
                  {t("submitBattle.disadvantages")}
                </label>
                {impl.cons.map((con, conIndex) => (
                  <div
                    key={conIndex}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Input
                      type="text"
                      value={con}
                      onChange={handleUpdateCon(implIndex, conIndex)}
                      className="flex-1 px-3 py-2 text-sm"
                      placeholder={t("submitBattle.disadvantagePlaceholder")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCon(implIndex, conIndex)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      disabled={impl.cons.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAddCon(implIndex)}
                  className="mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("submitBattle.addDisadvantage")}</span>
                </Button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                  {t("submitBattle.tags")}
                </label>
                <Input
                  type="text"
                  value={impl.tags.join(", ")}
                  onChange={handleUpdateImplTags(implIndex)}
                  className="w-full px-3 py-2 text-sm"
                  placeholder={t("submitBattle.tagsPlaceholder")}
                />
              </div>
            </Card>
          ))}

          {battle.implementations.length < 4 && (
            <Card className="p-6 mb-6 border-dashed">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddImplementation}
                className="w-full py-4 border-2 border-dashed rounded-lg hover:border-cyan-500 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-6 h-6" />
                <span className="font-semibold">
                  {t("submitBattle.addMoreImplementations")}
                </span>
              </Button>
            </Card>
          )}

          <div className="flex justify-center space-x-6">
            <Button
              type="submit"
              className="px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200 font-bold text-lg flex items-center space-x-3 shadow-lg hover:shadow-green-500/25"
            >
              <Upload className="w-6 h-6" />
              <span>{t("submitBattle.submitBattle")}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleNavigateArena}
              className="px-8 py-4 font-bold text-lg flex items-center space-x-3"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>{t("submitBattle.cancel")}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
