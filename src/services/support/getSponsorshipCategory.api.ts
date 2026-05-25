import type { SponsorshipCategory } from '../../interfaces/support/support.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * Fetches sponsorship categories for support tickets.
 */
export const getSponsorshipCategory = async (): Promise<ApiResponse<SponsorshipCategory[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getSponsorshipCategory;
    const url = `/api/method/chances_game.chances_game.${folder}.${file}.${methodName}`;

    return api.get<ApiResponse<SponsorshipCategory[]>>(url);
};
