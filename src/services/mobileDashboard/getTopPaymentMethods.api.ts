import type { ApiResponse } from '../api/apiClient';
import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface TopPaymentMethodPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface TopPaymentMethodsResponse {
    title: string;
    data: {
        topPaymentMethodsData: TopPaymentMethodPoint[];
        yAxisDomain?: [number, number];
    };
}

export const getTopPaymentMethods = async (dateFormat?: number, sponsorshipType?: string): Promise<ApiResponse<TopPaymentMethodsResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getMobileTopPaymentMethods;
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

    return api.get<ApiResponse<TopPaymentMethodsResponse>>(url);
};
