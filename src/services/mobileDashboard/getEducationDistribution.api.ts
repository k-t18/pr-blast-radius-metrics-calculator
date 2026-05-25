import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface EducationDistributionPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface EducationDistributionResponse {
    title: string;
    data: {
        distributionData: EducationDistributionPoint[];
        yAxisDomain?: [number, number];
    };
}

export const getEducationDistribution = async (
    dateFormat?: number,
    sponsorshipType?: string
): Promise<ApiResponse<EducationDistributionResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getMobileEducationDistribution;
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

    return api.get<ApiResponse<EducationDistributionResponse>>(url);
};
