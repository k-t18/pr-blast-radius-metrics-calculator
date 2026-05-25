import type { SupportTicketApiItem } from '../../interfaces/support/support.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * Retrieves support tickets with pagination.
 */
export const getSupportTickets = async (limit: number = 10, offset: number = 0, ticketId?: string): Promise<ApiResponse<SupportTicketApiItem[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getSupportTickets;
    const queryParameters = new URLSearchParams();
    queryParameters.append('limit', String(limit));
    queryParameters.append('offset', String(offset));
    if (ticketId) {
        queryParameters.append('id', ticketId);
    }

    const url = `/api/method/chances_game.chances_game.${folder}.${file}.${methodName}?${queryParameters.toString()}`;

    return api.get<ApiResponse<SupportTicketApiItem[]>>(url);
};
