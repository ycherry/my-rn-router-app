import { CreateBattlePageStoreProvider } from "./_store";
import { CreateBattlePageContent } from "./CreateBattlePageContent";

export const CreateBattlePage = () => {
  return (
    <CreateBattlePageStoreProvider>
      <CreateBattlePageContent />
    </CreateBattlePageStoreProvider>
  );
};
