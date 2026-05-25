import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

export type CampaignFilterKey = 'creatives_id' | 'order_id' | 'campaign_name';

export interface CampaignFilterOption {
    name: string;
}

export interface GetCampaignFiltersResponse extends ApiResponse<CampaignFilterOption[]> {}

export interface GetCampaignFiltersParameters {
    filter: CampaignFilterKey;
}

/**
 * Campaign filter options API for Ads Campaign table.
 * Returns a list of available values for the provided filter key.
 *
 * Backend: chances_game.api.sponsor_api.v1.campaign.get_campaigns_filters?filter=<key>
 */
export const getCampaignFilters = (parameters: GetCampaignFiltersParameters) => {
    const queryParameters = new URLSearchParams();
    queryParameters.append('filter', parameters.filter);
    const queryString = queryParameters.toString();

    const { folder, file, function: methodName } = apiRegistry.getCampaignsFilters;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;
    return api.get<GetCampaignFiltersResponse>(endpoint);
};
