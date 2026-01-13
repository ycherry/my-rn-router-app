import { type ReactNode } from "react";
import { LoginPageStoreContext, createLoginPageStore } from "./loginPageStore";
import { useInit } from "@/hooks/useInit";

interface Props {
  children: ReactNode;
}

export const LoginPageStoreProvider = ({ children }: Props) => {
  const store = useInit(() => createLoginPageStore());

  return (
    <LoginPageStoreContext.Provider value={store}>
      {children}
    </LoginPageStoreContext.Provider>
  );
};