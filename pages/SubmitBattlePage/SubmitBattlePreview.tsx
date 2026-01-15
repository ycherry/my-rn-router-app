import { ArrowLeft, Eye, Settings, Upload, User, Code2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "zustand";
import { useSubmitBattleStore } from "./_store";
import { type ImplementationForm } from "./_store/types";
import { useTRPC } from "@/integrations/trpc/react";
import { useTranslation } from "react-i18next";
import { Button, Card, Badge } from "@code-arena/ui";

export const SubmitBattlePreview = () => {
  const navigate = useNavigate();
  const trpc = useTRPC();
  const store = useSubmitBattleStore();
  const { t } = useTranslation();
  const { battle, previewMode, setPreviewMode, resetBattle } = useStore(store);
  const createBattleMutation = useMutation(
    trpc.battles.create.mutationOptions()
  );

  if (!previewMode) {
    return null;
  }

  const handleClose = () => setPreviewMode(false);

  const handleCancel = () => {
    setPreviewMode(false);
    navigate({ to: "/arena" });
  };

  const handleConfirm = () => {
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
  const previewBattle = {
    id: "preview",
    title: battle.title || t("submitBattle.untitledBattle"),
    description: battle.description || t("submitBattle.noDescription"),
    category: battle.category,
    totalVotes: 0,
    implementations: battle.implementations.map((impl, index) => ({
      id: `preview-impl-${index}`,
      title: impl.title || t("submitBattle.untitledBattle"),
      description: impl.description || t("submitBattle.noDescription"),
      code: impl.code,
      author: impl.author || t("submitBattle.authorPlaceholder"),
      pros: impl.pros.filter((p) => p.trim()),
      cons: impl.cons.filter((c) => c.trim()),
      tags: impl.tags.filter((t) => t.trim()),
      votes: 0,
    })),
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/5 blur-3xl delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 animate-pulse rounded-full bg-red-500/5 blur-2xl delay-2000" />
      </div>

      <nav className="relative z-10 flex items-center justify-between border-b p-6 backdrop-blur-sm bg-background/95 border-border">
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
            CODE ARENA
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-green-400">
            <span className="text-sm">{t("submitBattle.previewMode")}</span>
          </div>

          <Button
            onClick={handleClose}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>{t("submitBattle.backToEdit")}</span>
          </Button>

          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("submitBattle.backToArena")}</span>
          </Button>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="mb-12 text-center">
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-center">
              <div className="mr-4 h-8 w-8 text-cyan-400">⚔️</div>
              <h1 className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
                {previewBattle.title}
              </h1>
              <div className="ml-4 h-8 w-8 text-purple-400">⚔️</div>
            </div>

            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-muted-foreground">
              {previewBattle.description}
            </p>
          </div>

          <Card className="mx-auto max-w-4xl p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-cyan-400">
                  {previewBattle.implementations.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("submitBattle.combatants")}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl font-bold text-purple-400">
                  {previewBattle.totalVotes}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("submitBattle.totalVotes")}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-sm font-semibold text-yellow-400">
                  {previewBattle.category}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("submitBattle.techStackLabel")}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-sm font-semibold text-orange-400">
                  {[
                    ...new Set(
                      previewBattle.implementations.flatMap(
                        (impl: ImplementationForm) => impl.tags || []
                      )
                    ),
                  ]
                    .slice(0, 3)
                    .join(", ")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("submitBattle.tagsLabel")}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mb-8 p-6">
          <div className="text-center">
            <Eye className="mx-auto mb-3 h-8 w-8 text-blue-400" />
            <h3 className="mb-2 text-xl font-bold text-blue-400">
              {t("submitBattle.previewMode")}
            </h3>
            <p className="text-blue-300">
              {t("submitBattle.previewDescription")}
            </p>
          </div>
        </Card>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {previewBattle.implementations.map((implementation, index) => (
            <div key={implementation.id} className="relative">
              <div className="absolute -left-3 -top-3 z-10">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r text-lg font-bold text-white ${
                    index === 0
                      ? "from-cyan-500 to-blue-600"
                      : "from-purple-500 to-pink-600"
                  }`}
                >
                  {index === 0 ? "A" : "B"}
                </div>
              </div>

              <Card className="p-6 transition-all duration-300 hover:border-cyan-400/50">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {implementation.title}
                    </h3>
                    <p className="text-sm line-clamp-2 text-muted-foreground">
                      {implementation.description}
                    </p>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="border-purple-500/30 bg-purple-500/10 text-purple-400"
                  >
                    {previewBattle.category}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="rounded-lg p-4 bg-muted/50">
                    <pre className="max-h-32 overflow-x-auto font-mono text-xs text-foreground">
                      {implementation.code || t("submitBattle.noCode")}
                    </pre>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("submitBattle.authorLabel")}
                      {implementation.author}
                    </span>
                  </div>
                </div>

                {implementation.pros.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-green-400">
                      {t("submitBattle.advantages")}
                    </h4>
                    <ul className="space-y-1">
                      {implementation.pros.map((pro, i) => (
                        <li
                          key={i}
                          className="flex items-start text-sm text-green-300"
                        >
                          <span className="mr-2 text-green-400">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {implementation.cons.length > 0 && (
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold text-red-400">
                      {t("submitBattle.disadvantages")}
                    </h4>
                    <ul className="space-y-1">
                      {implementation.cons.map((con, i) => (
                        <li
                          key={i}
                          className="flex items-start text-sm text-red-300"
                        >
                          <span className="mr-2 text-red-400">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {implementation.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {implementation.tags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-cyan-500/30 bg-cyan-900/30 text-cyan-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>0 {t("submitBattle.votes")}</span>
                  </div>
                  <Button disabled variant="secondary">
                    {t("submitBattle.previewMode")}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-6">
          <Button
            onClick={handleConfirm}
            disabled={createBattleMutation.isPending}
            className="flex items-center space-x-3 px-8 py-4 text-lg font-bold shadow-lg"
          >
            <Upload className="h-6 w-6" />
            <span>
              {createBattleMutation.isPending
                ? t("submitBattle.publishing")
                : t("submitBattle.confirmPublish")}
            </span>
          </Button>

          <Button
            onClick={handleClose}
            variant="outline"
            className="flex items-center space-x-3 px-8 py-4 text-lg font-bold"
          >
            <Settings className="h-6 w-6" />
            <span>{t("submitBattle.backToEdit")}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
