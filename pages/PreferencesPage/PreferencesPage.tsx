import { PreferencesPageStoreProvider } from "./_store";
import { PreferencesPageContent } from "./PreferencesPageContent";

export const PreferencesPage = () => {
  return (
    <PreferencesPageStoreProvider>
      <PreferencesPageContent />
    </PreferencesPageStoreProvider>
  );
};
