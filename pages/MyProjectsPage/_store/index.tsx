import { createContext, ReactNode, useContext, useRef } from "react";
import { createStore, useStore as useZustandStore } from "zustand";

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
}

interface MyProjectsPageState {
  projects: Project[];
  loading: boolean;
  setProjects: (projects: Project[]) => void;
  setLoading: (loading: boolean) => void;
}

type MyProjectsPageStore = ReturnType<typeof createMyProjectsPageStore>;

const createMyProjectsPageStore = () => {
  return createStore<MyProjectsPageState>((set) => ({
    projects: [],
    loading: false,
    setProjects: (projects: Project[]) => set({ projects }),
    setLoading: (loading: boolean) => set({ loading }),
  }));
};

const MyProjectsPageStoreContext = createContext<MyProjectsPageStore | null>(null);

export const MyProjectsPageStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<MyProjectsPageStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createMyProjectsPageStore();
  }
  return (
    <MyProjectsPageStoreContext.Provider value={storeRef.current}>
      {children}
    </MyProjectsPageStoreContext.Provider>
  );
};

export const useMyProjectsPageStore = () => {
  const store = useContext(MyProjectsPageStoreContext);
  if (!store) {
    throw new Error(
      "useMyProjectsPageStore must be used within MyProjectsPageStoreProvider"
    );
  }
  return store;
};

export const useMyProjectsPageState = <T,>(
  selector: (state: MyProjectsPageState) => T
): T => {
  const store = useMyProjectsPageStore();
  return useZustandStore(store, selector);
};
