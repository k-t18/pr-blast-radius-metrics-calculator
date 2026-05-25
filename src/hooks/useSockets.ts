import { useEffect } from 'react';
import { Manager } from 'socket.io-client';
import { useNotificationStore } from '../stores/notificationStore';
import { useAuthStore } from '../stores/authStore';

const siteName = 'dev-chances.8848digitalerp.com';
const baseUrl = 'https://dev-chances.8848digitalerp.com';

// Use Manager to explicitly control namespace connection
// This ensures the namespace is correctly specified
const manager = new Manager(baseUrl, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    path: '/socket.io',
});

const useSockets = () => {
    const token = useAuthStore(state => state.token);
    const email = useAuthStore(state => state.email);
    const addNotification = useNotificationStore(state => state.addNotification);

    useEffect(() => {
        // sid is httpOnly — browser sends it automatically via withCredentials
        if (!token || !email) {
            return;
        }

        // Connect to the specific namespace with authentication
        const socket = manager.socket(`/${siteName}`, {
            auth: { token: `token ${token}` },
        });

        let retryTimeout: ReturnType<typeof setTimeout>;

        socket.on('connect', () => {
            clearTimeout(retryTimeout);
            /* eslint-disable no-console */
            console.log('Connected to Socket Server');
            console.log('Socket ID:', socket.id);
            /* eslint-enable no-console */
        });

        socket.on(`chances-notifications-${email}`, data => {
            /* eslint-disable no-console */
            console.log('🔔 Notification received:', data.subject);
            /* eslint-enable no-console */

            // Add notification to store
            addNotification({
                name: data.name,
                content: data.content,
                creation: data.creation,
                document_name: data.document_name,
                document_type: data.document_type,
                subject: data.subject,
            });
        });

        // Listen for all events for debugging
        socket.onAny((event, data) => {
            /* eslint-disable no-console */
            console.log(`📡 Raw Event [${event}]:`, data);
            /* eslint-enable no-console */
        });

        socket.on('connect_error', error => {
            /* eslint-disable no-console */
            console.error('❌ Socket Error:', error.message);
            /* eslint-enable no-console */
            // httpOnly sid cookie may not be committed yet on first login — retry after short delay
            retryTimeout = setTimeout(() => socket.connect(), 1000);
        });

        socket.on('disconnect', reason => {
            /* eslint-disable no-console */
            console.log('❌ Disconnected:', reason);
            /* eslint-enable no-console */
        });

        // Cleanup on unmount or when auth changes
        return () => {
            clearTimeout(retryTimeout);
            socket.off('connect');
            socket.off(`chances-notifications-${email}`);
            socket.off('connect_error');
            socket.off('disconnect');
            socket.offAny();
            socket.disconnect();
        };
    }, [token, email, addNotification]);
};

export default useSockets;
