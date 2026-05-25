import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Notification {
    name: string;
    content: string;
    creation: string;
    document_name: string;
    document_type: string;
    subject: string;
    isRead?: boolean;
}

interface NotificationState {
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
    markAsRead: (documentName: string) => void;
    markAllAsRead: () => void;
    clearAllNotifications: () => void;
}

/**
 * Notification store to manage real-time notifications from socket
 * Persisted to localStorage to survive page reloads
 */
export const useNotificationStore = create<NotificationState>()(
    persist(
        set => ({
            notifications: [],

            setNotifications: notifications => set({ notifications }),

            addNotification: notification =>
                set(state => ({
                    notifications: [{ ...notification, isRead: false }, ...state.notifications],
                })),

            markAsRead: documentName =>
                set(state => ({
                    notifications: state.notifications.map(n => (n.document_name === documentName ? { ...n, isRead: true } : n)),
                })),

            markAllAsRead: () =>
                set(state => ({
                    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                })),

            clearAllNotifications: () => set({ notifications: [] }),
        }),
        {
            name: 'notification-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
