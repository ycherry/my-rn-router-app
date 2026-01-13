import { createContext, useContext } from "react";
import {
  createStore,
  type Mutate,
  type StateCreator,
  type StoreApi,
} from "zustand";
import { createLoginPageSlice, type LoginPageSlice } from "./loginPageSlice";

export interface LoginPageState extends LoginPageSlice {}

export type LoginPageStoreSlice<T> = StateCreator<LoginPageState, [], [], T>;

export type LoginPageStore = Mutate<StoreApi<LoginPageState>, []>;

export const createLoginPageStore = () => {
  const store = createStore<LoginPageState>()((set, get, api) => ({
    ...createLoginPageSlice(set, get, api),
  }));

  return store;
};

export const LoginPageStoreContext = createContext<LoginPageStore | null>(null);

export const useLoginPageStore = () => {
  const context = useContext(LoginPageStoreContext);
  if (!context) {
    throw new Error(
      "useLoginPageStore must be used within a LoginPageStoreProvider"
    );
  }
  return context;
};