import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

export interface WinnerCard {
    label: string;
    value: number;
    changePercentage: number;
    changeType: '' | 'increase' | 'decrease';
    suffix?: string;
    currency?: string;
}

export type WinnerCardsResponse = ApiResponse<WinnerCard[]>;

/**
 * Fetch overall winner cards metrics.
 */
export const getWinnerCards = async (): Promise<WinnerCardsResponse> => {
    const { folder, file, function: methodName } = apiRegistry.winnerCards;
    const url = `/api/method/chances_game.chances_game.${folder}.${file}.${methodName}`;

    return api.get<WinnerCardsResponse>(url);
};
