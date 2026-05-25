import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface NotificationLog {
    name: string;
    subject: string;
    document_type: string;
    document_name: string;
    creation: string;
    content: string;
    read: 0 | 1;
}

export interface GetUserNotificationLogResponse extends ApiResponse<NotificationLog[]> {}

export const getUserNotificationLog = () => {
    const { folder, file, function: methodName } = apiRegistry.getUserNotificationLog;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<GetUserNotificationLogResponse>(url);
};
