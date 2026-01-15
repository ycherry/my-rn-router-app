import { type StateCreator } from "zustand";
import { type BattleForm, type ImplementationForm } from "./types.js";

export interface SubmitBattleSlice {
  battle: BattleForm;
  previewMode: boolean;

  // Actions
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
  setPreviewMode: (mode: boolean) => void;
  resetBattle: () => void;
}

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

export const createSubmitBattleSlice: StateCreator<SubmitBattleSlice> = (
  set
) => ({
  battle: initialBattle,
  previewMode: false,

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

  setPreviewMode: (mode) => set({ previewMode: mode }),

  resetBattle: () => set({ battle: initialBattle, previewMode: false }),
});
