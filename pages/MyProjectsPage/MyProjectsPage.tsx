import { MyProjectsPageStoreProvider } from "./_store";
import { MyProjectsPageContent } from "./MyProjectsPageContent";

export const MyProjectsPage = () => {
  return (
    <MyProjectsPageStoreProvider>
      <MyProjectsPageContent />
    </MyProjectsPageStoreProvider>
  );
};
