import { useSyncExternalStore } from "react";
import { api } from "../api/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

type AuthResponse = {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

const saveSession = (data: AuthResponse) => {
  localStorage.setItem("accessToken", data.tokens.accessToken);
  localStorage.setItem("refreshToken", data.tokens.refreshToken);
  localStorage.setItem("user", JSON.stringify(data.user));
};

const getInitialUser = () => {
  const user = localStorage.getItem("user");

  return user ? (JSON.parse(user) as User) : null;
};

let state: AuthState;
const listeners = new Set<() => void>();

const setState = (partial: Partial<AuthState>) => {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

state = {
  user: getInitialUser(),
  loading: false,
  error: "",
  login: async (email, password) => {
    setState({ loading: true, error: "" });

    try {
      const { data } = await api.post<AuthResponse>("/auth/login", { email, password });

      saveSession(data);
      setState({ user: data.user, loading: false });
    } catch (error) {
      setState({ error: "Credenciales invalidas", loading: false });
      throw error;
    }
  },
  register: async (name, email, password) => {
    setState({ loading: true, error: "" });

    try {
      const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });

      saveSession(data);
      setState({ user: data.user, loading: false });
    } catch (error) {
      setState({ error: "No se pudo crear la cuenta", loading: false });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setState({ user: null });
  }
};

export function useAuthStore(): AuthState;
export function useAuthStore<T>(selector: (state: AuthState) => T): T;
export function useAuthStore<T>(selector?: (state: AuthState) => T) {
  const currentState = useSyncExternalStore(subscribe, () => state);

  return selector ? selector(currentState) : currentState;
}
