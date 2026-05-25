import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { getUserNotificationLog } from '../services/notifications/getUserNotificationLog.api';
import { useApiQuery } from './useApiQuery';

export function useNotifications() {
    const token = useAuthStore(state => state.token);
    const setNotifications = useNotificationStore(state => state.setNotifications);

    const { data } = useApiQuery({
        queryKey: ['notifications'],
        queryFn: getUserNotificationLog,
        enabled: !!token,
        showErrorToast: false,
    });

    useEffect(() => {
        if (data?.data) {
            setNotifications(
                data.data.map(log => ({
                    name: log.name,
                    content: log.content,
                    creation: log.creation,
                    document_name: log.document_name,
                    document_type: log.document_type,
                    subject: log.subject,
                    isRead: log.read === 1,
                }))
            );
        }
    }, [data, setNotifications]);
}
