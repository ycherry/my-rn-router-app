import { useInit } from "@/hooks/useInit";
import { type ReactNode } from "react";
import { UserStoreContext, createUserStore } from "./userStore";

interface Props {
  children: ReactNode;
}

export const UserStoreProvider = ({ children }: Props) => {
  const store = useInit(() => createUserStore());

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
};