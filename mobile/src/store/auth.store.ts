import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../services/auth.api";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const response = await authApi.login(email, password);
    await AsyncStorage.setItem("token", response.token);
    set({ token: response.token, isAuthenticated: true });
  },

  register: async (username, email, password) => {
    const response = await authApi.register(username, email, password);
    await AsyncStorage.setItem("token", response.token);
    set({ token: response.token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem("token");
    set({ token, isAuthenticated: !!token, isLoading: false });
  },
}));
