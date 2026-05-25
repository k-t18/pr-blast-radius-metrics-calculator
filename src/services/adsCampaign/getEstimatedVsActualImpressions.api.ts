import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface EstimatedActualResponse {
    impressionsList: { name: string; estimated: number; actual: number }[];
    yAxisDomain: [number, number];
}

export const getEstimatedVsActualImpressions = async (dateFormat?: number): Promise<ApiResponse<EstimatedActualResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getEstimatedVsActualImpressions;
    const url = buildFrappeMethodURL(folder, file, methodName);

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }
    const queryString = queryParameters.toString();
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<EstimatedActualResponse>>(endpoint);
};
