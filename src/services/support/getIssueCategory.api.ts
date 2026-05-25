import type { IssueCategory } from '../../interfaces/support/support.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * Fetches issue categories for support tickets.
 */
export const getIssueCategory = async (): Promise<ApiResponse<IssueCategory[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getIssueCategory;
    const url = `/api/method/chances_game.chances_game.${folder}.${file}.${methodName}`;

    return api.get<ApiResponse<IssueCategory[]>>(url);
};
