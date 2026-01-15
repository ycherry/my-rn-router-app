import { createContext, ReactNode, useContext, useRef } from "react";
import { createStore, useStore as useZustandStore } from "zustand";

export interface ImplementationForm {
  title: string;
  description: string;
  code: string;
  author: string;
  pros: string[];
  cons: string[];
  tags: string[];
}

export interface BattleForm {
  title: string;
  description: string;
  category: string;
  implementations: ImplementationForm[];
}

interface CreateBattlePageState {
  battle: BattleForm;
  loading: boolean;
  updateBattle: (field: keyof BattleForm, value: unknown) => void;
  updateImplementation: (
    index: number,
    field: keyof ImplementationForm,
    value: unknown
  ) => void;
  addImplementation: () => void;
  removeImplementation: (index: number) => void;
  addPro: (implIndex: number) => void;
  removePro: (implIndex: number, proIndex: number) => void;
  updatePro: (implIndex: number, proIndex: number, value: string) => void;
  addCon: (implIndex: number) => void;
  removeCon: (implIndex: number, conIndex: number) => void;
  updateCon: (implIndex: number, conIndex: number, value: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

type CreateBattlePageStore = ReturnType<typeof createCreateBattlePageStore>;

const initialBattle: BattleForm = {
  title: "",
  description: "",
  category: "javascript",
  implementations: [
    {
      title: "",
      description: "",
      code: "",
      author: "",
      pros: [""],
      cons: [""],
      tags: [""],
    },
    {
      title: "",
      description: "",
      code: "",
      author: "",
      pros: [""],
      cons: [""],
      tags: [""],
    },
  ],
};

const createCreateBattlePageStore = () => {
  return createStore<CreateBattlePageState>((set) => ({
    battle: initialBattle,
    loading: false,

    updateBattle: (field, value) =>
      set((state) => ({
        battle: { ...state.battle, [field]: value },
      })),

    updateImplementation: (index, field, value) =>
      set((state) => ({
        battle: {
          ...state.battle,
          implementations: state.battle.implementations.map((impl, i) =>
            i === index ? { ...impl, [field]: value } : impl
          ),
        },
      })),

    addImplementation: () =>
      set((state) => {
        if (state.battle.implementations.length >= 4) return state;
        return {
          battle: {
            ...state.battle,
            implementations: [
              ...state.battle.implementations,
              {
                title: "",
                description: "",
                code: "",
                author: "",
                pros: [""],
                cons: [""],
                tags: [""],
              },
            ],
          },
        };
      }),

    removeImplementation: (index) =>
      set((state) => {
        if (state.battle.implementations.length <= 2) return state;
        return {
          battle: {
            ...state.battle,
            implementations: state.battle.implementations.filter(
              (_, i) => i !== index
            ),
          },
        };
      }),

    addPro: (implIndex) =>
      set((state) => ({
        battle: {
          ...state.battle,
          implementations: state.battle.implementations.map((impl, i) =>
            i === implIndex ? { ...impl, pros: [...impl.pros, ""] } : impl
          ),
        },
      })),

    removePro: (implIndex, proIndex) =>
      set((state) => ({
        battle: {
          ...state.battle,
          implementations: state.battle.implementations.map((impl, i) =>
            i === implIndex
              ? {
                  ...impl,
                  pros: impl.pros.filter((_, j) => j !== proIndex),
                }
              : impl
          ),
        },
      })),

    updatePro: (implIndex, proIndex, value) =>
      set((state) => ({
        battle: {
          ...state.battle,
          implementations: state.battle.implementations.map((impl, i) =>
            i === implIndex
              ? {
                  ...impl,
                  pros: impl.pros.map((pro, j) => (j === proIndex ? value : pro)),
                }
              : impl
          ),
        },
      })),

    addCon: (implIndex) =>
      set((state) => ({
        battle: {
          ...state.battle,
          implementations: state.battle.implementations.map((impl, i) =>
            i === implIndex ? { ...impl, cons: [...impl.cons, ""] } : impl
          ),
        },
      })),

    removeCon: (implIndex, conIndex) =>
      set((state) => ({
        battle: {
          ...state.battle,
          implementations: state.battle.implementations.map((impl, i) =>
            i === implIndex
              ? {
                  ...impl,
                  cons: impl.cons.filter((_, j) => j !== conIndex),
                }
              : impl
          ),
        },
      })),

    updateCon: (implIndex, conIndex, value) =>
      set((state) => ({
        battle: {
          ...state.battle,
          implementations: state.battle.implementations.map((impl, i) =>
            i === implIndex
              ? {
                  ...impl,
                  cons: impl.cons.map((con, j) => (j === conIndex ? value : con)),
                }
              : impl
          ),
        },
      })),

    setLoading: (loading: boolean) => set({ loading }),

    reset: () => set({ battle: initialBattle, loading: false }),
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
