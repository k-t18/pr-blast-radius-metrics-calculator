import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface ReadNotificationResponse extends ApiResponse<null> {}

export const readNotification = (name: string) => {
    const { folder, file, function: methodName } = apiRegistry.readNotification;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const body = new FormData();
    body.append('name', name);
    return api.post<ReadNotificationResponse>(url, body);
};
