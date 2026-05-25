import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface EstimatedActualClicksResponse {
    clicksList: { name: string; estimated: number; actual: number }[];
    yAxisDomain: [number, number];
}

export const getEstimatedVsActualClicks = async (dateFormat?: number): Promise<ApiResponse<EstimatedActualClicksResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getEstimatedVsActualClicks;
    const url = buildFrappeMethodURL(folder, file, methodName);

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }
    const queryString = queryParameters.toString();
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<EstimatedActualClicksResponse>>(endpoint);
};
