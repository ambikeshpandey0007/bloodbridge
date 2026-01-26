import { create } from 'zustand';

export type UserType = 'public' | 'hospital' | null;

interface AuthState {
  userType: UserType;
  userId: string | null;
  setUserType: (type: UserType, userId?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userType: null,
  userId: null,
  setUserType: (type: UserType, userId?: string) => {
    set({ userType: type, userId: userId || null });
  },
  logout: () => {
    set({ userType: null, userId: null });
  },
}));
