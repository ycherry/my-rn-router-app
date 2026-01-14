import { createContext, ReactNode, useContext, useRef } from "react";
import { createStore, useStore as useZustandStore } from "zustand";

interface VoteRecord {
  id: string;
  battleTitle: string;
  votedFor: string;
  votedAt: string;
  result?: string;
}

interface VotingHistoryPageState {
  votes: VoteRecord[];
  loading: boolean;
  setVotes: (votes: VoteRecord[]) => void;
  setLoading: (loading: boolean) => void;
}

type VotingHistoryPageStore = ReturnType<typeof createVotingHistoryPageStore>;

const createVotingHistoryPageStore = () => {
  return createStore<VotingHistoryPageState>((set) => ({
    votes: [],
    loading: false,
    setVotes: (votes: VoteRecord[]) => set({ votes }),
    setLoading: (loading: boolean) => set({ loading }),
  }));
};

const VotingHistoryPageStoreContext = createContext<VotingHistoryPageStore | null>(null);

export const VotingHistoryPageStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<VotingHistoryPageStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createVotingHistoryPageStore();
  }
  return (
    <VotingHistoryPageStoreContext.Provider value={storeRef.current}>
      {children}
    </VotingHistoryPageStoreContext.Provider>
  );
};

export const useVotingHistoryPageStore = () => {
  const store = useContext(VotingHistoryPageStoreContext);
  if (!store) {
    throw new Error(
      "useVotingHistoryPageStore must be used within VotingHistoryPageStoreProvider"
    );
  }
  return store;
};

export const useVotingHistoryPageState = <T,>(
  selector: (state: VotingHistoryPageState) => T
): T => {
  const store = useVotingHistoryPageStore();
  return useZustandStore(store, selector);
};
