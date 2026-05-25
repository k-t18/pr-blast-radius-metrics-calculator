import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface GenderDistributionPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface GenderDistributionResponse {
    title: string;
    data: {
        genderDistributionData: GenderDistributionPoint[];
    };
}

export const getGenderDistribution = async (dateFormat?: number, sponsorshipType?: string): Promise<ApiResponse<GenderDistributionResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getMobileGenderDistribution;
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

    return api.get<ApiResponse<GenderDistributionResponse>>(url);
};
