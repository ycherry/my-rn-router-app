import { createContext, ReactNode, useContext, useRef } from "react";
import { createStore, useStore as useZustandStore } from "zustand";

interface CreateBattlePageState {
  battleTitle: string;
  battleDescription: string;
  githubRepo: string;
  loading: boolean;
  setBattleTitle: (title: string) => void;
  setBattleDescription: (description: string) => void;
  setGithubRepo: (repo: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

type CreateBattlePageStore = ReturnType<typeof createCreateBattlePageStore>;

const createCreateBattlePageStore = () => {
  return createStore<CreateBattlePageState>((set) => ({
    battleTitle: "",
    battleDescription: "",
    githubRepo: "",
    loading: false,
    setBattleTitle: (title: string) => set({ battleTitle: title }),
    setBattleDescription: (description: string) => set({ battleDescription: description }),
    setGithubRepo: (repo: string) => set({ githubRepo: repo }),
    setLoading: (loading: boolean) => set({ loading }),
    reset: () => set({
      battleTitle: "",
      battleDescription: "",
      githubRepo: "",
      loading: false,
    }),
  }));
};

const CreateBattlePageStoreContext = createContext<CreateBattlePageStore | null>(null);

export const CreateBattlePageStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<CreateBattlePageStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createCreateBattlePageStore();
  }
  return (
    <CreateBattlePageStoreContext.Provider value={storeRef.current}>
      {children}
    </CreateBattlePageStoreContext.Provider>
  );
};

export const useCreateBattlePageStore = () => {
  const store = useContext(CreateBattlePageStoreContext);
  if (!store) {
    throw new Error(
      "useCreateBattlePageStore must be used within CreateBattlePageStoreProvider"
    );
  }
  return store;
};

export const useCreateBattlePageState = <T,>(
  selector: (state: CreateBattlePageState) => T
): T => {
  const store = useCreateBattlePageStore();
  return useZustandStore(store, selector);
};
