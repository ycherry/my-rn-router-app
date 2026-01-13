import { createContext, useContext } from "react";
import {
  createStore,
  type Mutate,
  type StateCreator,
  type StoreApi,
} from "zustand";
import { createArenaPageSlice, type ArenaPageSlice } from "./arenaPageSlice";

export interface ArenaPageState extends ArenaPageSlice {}

export type ArenaPageStoreSlice<T> = StateCreator<ArenaPageState, [], [], T>;

export type ArenaPageStore = Mutate<StoreApi<ArenaPageState>, []>;

export const createArenaPageStore = () => {
  const store = createStore<ArenaPageState>()((set, get, api) => ({
    ...createArenaPageSlice(set, get, api),
  }));

  return store;
};

export const ArenaPageStoreContext = createContext<ArenaPageStore | null>(null);

export const useArenaPageStore = () => {
  const context = useContext(ArenaPageStoreContext);
  if (!context) {
    throw new Error(
      "useArenaPageStore must be used within a ArenaPageStoreProvider"
    );
  }
  return context;
};
