import type { AdsCampaign } from '../../interfaces/adsCampaign/adsCampaign.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export interface CampaignsResponse {
    data: AdsCampaign[];
    total: number;
}

export interface GetCampaignsParameters {
    status: string;
    limit?: number;
    offset?: number;
    creatives_id?: string;
    order_id?: string;
    campaign_name?: string;
}

export const getCampaigns = async ({
    status,
    limit = 10,
    offset = 0,
    creatives_id,
    order_id,
    campaign_name,
}: GetCampaignsParameters): Promise<ApiResponse<CampaignsResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getCampaigns;
    const baseUrl = buildFrappeMethodURL(folder, file, methodName);
    const queryParameters = new URLSearchParams();
    queryParameters.append('status', status);
    queryParameters.append('offset', String(offset));
    queryParameters.append('limit', String(limit));
    if (creatives_id) queryParameters.append('creatives_id', creatives_id);
    if (order_id) queryParameters.append('order_id', order_id);
    if (campaign_name) queryParameters.append('campaign_name', campaign_name);

    const url = `${baseUrl}?${queryParameters.toString()}`;

    return api.get<ApiResponse<CampaignsResponse>>(url);
};
