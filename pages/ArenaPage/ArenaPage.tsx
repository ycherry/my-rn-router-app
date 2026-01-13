import { ArenaPageStoreProvider } from "./_store";
import { ArenaPageContent } from "./ArenaPageContent";

export const ArenaPage = () => {
  return (
    <ArenaPageStoreProvider>
      <ArenaPageContent />
    </ArenaPageStoreProvider>
  );
};
