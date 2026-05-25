import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

export interface PeriodDataOption {
    name: string;
    numeric_days: number;
    label: string;
}

export type PeriodDataResponse = ApiResponse<PeriodDataOption[]>;

/**
 * Fetch period filter options.
 */
export const getPeriodData = async (): Promise<PeriodDataResponse> => {
    const { folder, file, function: methodName } = apiRegistry.getPeriodFilter;
    const url = `/api/method/chances_game.api.${folder}.${file}.${methodName}`;

    return api.get<PeriodDataResponse>(url);
};
