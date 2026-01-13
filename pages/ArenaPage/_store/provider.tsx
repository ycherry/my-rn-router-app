import { type ReactNode } from "react";
import { ArenaPageStoreContext, createArenaPageStore } from "./arenaPageStore";
import { useInit } from "@/hooks/useInit";

interface Props {
  children: ReactNode;
}

export const ArenaPageStoreProvider = ({ children }: Props) => {
  const store = useInit(() => createArenaPageStore());

  return (
    <ArenaPageStoreContext.Provider value={store}>
      {children}
    </ArenaPageStoreContext.Provider>
  );
};
