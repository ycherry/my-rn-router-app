import { createContext, useContext } from "react";
import {
  createStore,
  type Mutate,
  type StateCreator,
  type StoreApi,
} from "zustand";
import { createSubmitBattleSlice, type SubmitBattleSlice } from "./submitBattleSlice";

export interface SubmitBattleState extends SubmitBattleSlice {}

export type SubmitBattleStoreSlice<T> = StateCreator<SubmitBattleState, [], [], T>;

export type SubmitBattleStore = Mutate<StoreApi<SubmitBattleState>, []>;

export const createSubmitBattleStore = () => {
  const store = createStore<SubmitBattleState>()((set, get, api) => ({
    ...createSubmitBattleSlice(set, get, api),
  }));

  return store;
};

export const SubmitBattleStoreContext = createContext<SubmitBattleStore | null>(null);

export const useSubmitBattleStore = () => {
  const context = useContext(SubmitBattleStoreContext);
  if (!context) {
    throw new Error(
      "useSubmitBattleStore must be used within a SubmitBattleStoreProvider"
    );
  }
  return context;
};
