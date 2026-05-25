import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
    token: string | null;
    csrfToken: string | null;
    email: string | null;
    setToken: (token: string | null) => void;
    setCsrfToken: (csrfToken: string | null) => void;
    setEmail: (email: string | null) => void;
    clearToken: () => void;
    clearEmail: () => void;
}

/**
 * Simple auth store to keep the current API token in memory and persist it across reloads.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            token: null,
            csrfToken: null,
            email: null,
            setToken: token => set({ token }),
            setCsrfToken: csrfToken => set({ csrfToken }),
            setEmail: email => set({ email }),
            clearToken: () => set({ token: null, csrfToken: null }),
            clearEmail: () => set({ email: null }),
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
