import { type StateCreator } from "zustand";

export interface UserSlice {
  userName: string;
  userEmail: string;
  loading: boolean;

  // Actions
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setLoading: (loading: boolean) => void;
}

const initialState = {
  userName: "",
  userEmail: "",
  loading: false,
};

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  ...initialState,

  setUserName: (name) => set({ userName: name }),
  setUserEmail: (email) => set({ userEmail: email }),
  setLoading: (loading) => set({ loading }),
});