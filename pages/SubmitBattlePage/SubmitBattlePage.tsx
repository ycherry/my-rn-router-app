import { SubmitBattleStoreProvider } from "./_store";
import { SubmitBattlePageContent } from "./SubmitBattlePageContent";

export const SubmitBattlePage = () => {
  return (
    <SubmitBattleStoreProvider>
      <SubmitBattlePageContent />
    </SubmitBattleStoreProvider>
  );
};
