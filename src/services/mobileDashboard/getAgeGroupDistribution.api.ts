import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface AgeGroupDistributionPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface AgeGroupDistributionResponse {
    title: string;
    data: {
        distributionData: AgeGroupDistributionPoint[];
        yAxisDomain?: [number, number];
    };
}

export const getAgeGroupDistribution = async (dateFormat?: number, sponsorshipType?: string): Promise<ApiResponse<AgeGroupDistributionResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getMobileAgeGroupDistribution;
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

    return api.get<ApiResponse<AgeGroupDistributionResponse>>(url);
};
