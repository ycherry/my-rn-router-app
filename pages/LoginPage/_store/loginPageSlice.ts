import { type StateCreator } from "zustand";

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginPageSlice {
  showPassword: boolean;
  loginError: string | null;
  formData: LoginFormData;

  // Actions
  setShowPassword: (show: boolean) => void;
  setLoginError: (error: string | null) => void;
  setFormData: (data: Partial<LoginFormData>) => void;
  resetForm: () => void;
}

const initialFormData: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

export const createLoginPageSlice: StateCreator<LoginPageSlice> = (set) => ({
  showPassword: false,
  loginError: null,
  formData: initialFormData,

  setShowPassword: (show) => set({ showPassword: show }),
  setLoginError: (error) => set({ loginError: error }),
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  resetForm: () => set({ formData: initialFormData, loginError: null }),
});