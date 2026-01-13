import { LoginPageStoreProvider } from "./_store";
import { LoginPageContent } from "./LoginPageContent";

export const LoginPage = () => {
  return (
    <LoginPageStoreProvider>
      <LoginPageContent />
    </LoginPageStoreProvider>
  );
};