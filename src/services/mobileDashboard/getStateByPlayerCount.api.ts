import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface StateByPlayerCountPoint {
    state: string;
    value: number;
    [key: string]: string | number;
}

export interface StateByPlayerCountResponse {
    title: string;
    data: {
        topStateByPlayerCountData: StateByPlayerCountPoint[];
    };
}

export const getStateByPlayerCount = async (dateFormat?: number, sponsorshipType?: string): Promise<ApiResponse<StateByPlayerCountResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getMobileStateByPlayerCount;
    const baseUrl = buildFrappeMethodURL(folder, file, methodName);

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }
    if (sponsorshipType) {
        queryParameters.append('sponsorship_type', sponsorshipType);
    }
    const queryString = queryParameters.toString();
    const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<StateByPlayerCountResponse>>(url);
};
