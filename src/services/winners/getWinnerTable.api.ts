import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

export type WinnerCategory = 'mobile-game' | 'studio-show';

export type WinnerTableResponse<T> = ApiResponse<T[]>;

interface GetWinnerTableParameters {
    type: WinnerCategory;
    limit?: number;
    offset?: number;
    episode?: string;
    reward_type?: string;
    status?: string;
}

/**
 * Fetch winner table entries for a given category.
 *
 * @param params - Winner category and pagination parameters
 */
export const getWinnerTable = async <T>({
    type,
    limit = 10,
    offset = 0,
    episode,
    reward_type,
    status,
}: GetWinnerTableParameters): Promise<WinnerTableResponse<T>> => {
    const { folder, file, function: methodName } = apiRegistry.winnerTable;
    const searchParameters = new URLSearchParams();
    searchParameters.append('type', type);
    searchParameters.append('limit', String(limit));
    searchParameters.append('offset', String(offset));
    // Optional filters
    // Note: parameter names are aligned to expected backend query keys.
    if (episode) searchParameters.append('episode', episode);
    if (reward_type) searchParameters.append('reward_type', reward_type);
    if (status) searchParameters.append('status', status);

    const url = `/api/method/chances_game.chances_game.${folder}.${file}.${methodName}?${searchParameters.toString()}`;

    return api.get<WinnerTableResponse<T>>(url);
};
