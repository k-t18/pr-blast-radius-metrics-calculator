import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface TopCityPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface TopCitiesResponse {
    title: string;
    data: {
        topCitiesByPlayerCountData: TopCityPoint[];
        yAxisDomain?: [number, number];
    };
}

export const getTopCitiesByPlayerCount = async (dateFormat?: number, sponsorshipType?: string): Promise<ApiResponse<TopCitiesResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getMobileTopCitiesByPlayerCount;
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

    return api.get<ApiResponse<TopCitiesResponse>>(url);
};
