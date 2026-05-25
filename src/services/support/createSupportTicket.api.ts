import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

interface CreateSupportTicketPayload {
    subject: string;
    description: string;
    category: string;
    issue_type: string;
    user_type: string;
    sponsorship_type: string;
    priority?: string;
    attachments?: { filename: string }[];
}

export const createSupportTicket = async (payload: CreateSupportTicketPayload): Promise<ApiResponse<unknown>> => {
    /* eslint-disable no-console */
    console.log('payload', payload);
    const { folder, file, function: methodName } = apiRegistry.createSupportTicket;
    const url = `/api/method/chances_game.api.${folder}.${file}.${methodName}`;
    return api.post<ApiResponse<unknown>>(url, payload);
};
