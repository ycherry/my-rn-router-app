import { createContext, ReactNode, useContext, useRef } from "react";
import { createStore, useStore as useZustandStore } from "zustand";

interface PreferencesPageState {
  language: string;
  theme: string;
  notifications: boolean;
  loading: boolean;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  setNotifications: (enabled: boolean) => void;
  setLoading: (loading: boolean) => void;
}

type PreferencesPageStore = ReturnType<typeof createPreferencesPageStore>;

const createPreferencesPageStore = () => {
  return createStore<PreferencesPageState>((set) => ({
    language: "zh",
    theme: "light",
    notifications: true,
    loading: false,
    setLanguage: (language: string) => set({ language }),
    setTheme: (theme: string) => set({ theme }),
    setNotifications: (enabled: boolean) => set({ notifications: enabled }),
    setLoading: (loading: boolean) => set({ loading }),
  }));
};

const PreferencesPageStoreContext = createContext<PreferencesPageStore | null>(null);

export const PreferencesPageStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<PreferencesPageStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createPreferencesPageStore();
  }
  return (
    <PreferencesPageStoreContext.Provider value={storeRef.current}>
      {children}
    </PreferencesPageStoreContext.Provider>
  );
};

export const usePreferencesPageStore = () => {
  const store = useContext(PreferencesPageStoreContext);
  if (!store) {
    throw new Error(
      "usePreferencesPageStore must be used within PreferencesPageStoreProvider"
    );
  }
  return store;
};

export const usePreferencesPageState = <T,>(
  selector: (state: PreferencesPageState) => T
): T => {
  const store = usePreferencesPageStore();
  return useZustandStore(store, selector);
};
