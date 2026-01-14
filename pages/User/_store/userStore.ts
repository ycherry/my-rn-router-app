import { createContext, useContext } from "react";
import {
    createStore,
    type Mutate,
    type StateCreator,
    type StoreApi,
} from "zustand";
import { createUserSlice, type UserSlice } from "./userSlice";

export interface UserState extends UserSlice {}

export type UserStoreSlice<T> = StateCreator<UserState, [], [], T>;

export type UserStore = Mutate<StoreApi<UserState>, []>;

export const createUserStore = () => {
  const store = createStore<UserState>()((set, get, api) => ({
    ...createUserSlice(set, get, api),
  }));

  return store;
};

export const UserStoreContext = createContext<UserStore | null>(null);

export const useUserStore = () => {
  const context = useContext(UserStoreContext);
  if (!context) {
    throw new Error(
      "useUserStore must be used within a UserStoreProvider"
    );
  }
  return context;
};