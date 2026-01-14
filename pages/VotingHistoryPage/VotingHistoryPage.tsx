import { VotingHistoryPageStoreProvider } from "./_store";
import { VotingHistoryPageContent } from "./VotingHistoryPageContent";

export const VotingHistoryPage = () => {
  return (
    <VotingHistoryPageStoreProvider>
      <VotingHistoryPageContent />
    </VotingHistoryPageStoreProvider>
  );
};
