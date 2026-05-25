import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface AudienceReachAndExposureMetric {
    label: string;
    value: number;
    changePercentage: number;
    changeType: 'increase' | 'decrease' | 'neutral' | '';
    suffix?: string;
}

export interface AudienceReachAndExposureResponse {
    Title: string;
    audience_reach_and_exposure: AudienceReachAndExposureMetric[];
}

export const getAudienceReachAndExposure = async (dateFormat?: number): Promise<ApiResponse<AudienceReachAndExposureResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getMobileAudienceReachAndExposure;
    const baseUrl = buildFrappeMethodURL(folder, file, methodName);

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }

    const queryString = queryParameters.toString();
    const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<AudienceReachAndExposureResponse>>(url);
};
