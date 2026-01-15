import { type ReactNode } from "react";
import {
  SubmitBattleStoreContext,
  createSubmitBattleStore,
} from "./submitBattleStore";
import { useInit } from "@/hooks/useInit";

interface Props {
  children: ReactNode;
}

export const SubmitBattleStoreProvider = ({ children }: Props) => {
  const store = useInit(() => createSubmitBattleStore());

  return (
    <SubmitBattleStoreContext.Provider value={store}>
      {children}
    </SubmitBattleStoreContext.Provider>
  );
};
