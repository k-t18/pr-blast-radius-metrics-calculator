import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface GrowthInUsersPoint {
    date: string;
    value: number;
    [key: string]: string | number;
}

export interface GrowthInUsersResponse {
    title: string;
    data: {
        growthInUsersData: GrowthInUsersPoint[];
        yAxisDomain?: [number, number];
    };
}

export const getGrowthInUsers = async (dateFormat?: number, sponsorshipType?: string): Promise<ApiResponse<GrowthInUsersResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getMobileGrowthInUsers;
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

    return api.get<ApiResponse<GrowthInUsersResponse>>(url);
};
