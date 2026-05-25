import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';
import type { AdsCampaignMetricCard } from '../../interfaces/adsCampaign/adsCampaign.types';

/**
 * Fetch reward campaign metrics for ad campaigns.
 */
export const getRewardCampaignMetrics = async (dateFormat?: number): Promise<ApiResponse<AdsCampaignMetricCard[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getRewardCampaignMetrics;
    const url = buildFrappeMethodURL(folder, file, methodName);

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }
    const queryString = queryParameters.toString();
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<AdsCampaignMetricCard[]>>(endpoint);
};
