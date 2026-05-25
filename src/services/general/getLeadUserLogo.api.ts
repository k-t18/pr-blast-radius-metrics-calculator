import { api, type ApiResponse } from '../api/apiClient';

export interface LeadUserLogoData {
    url: string;
    file_name: string;
}

export interface GetLeadUserLogoResponse extends ApiResponse<LeadUserLogoData> {}

/**
 * Fetches the lead user logo from the API
 * The API endpoint is: /api/method/chances_game.chances_game.customization.common.retrieve_filters_data.get_lead_user_logo
 * @returns Promise with the logo data (url and file_name)
 */
export const getLeadUserLogo = async (): Promise<GetLeadUserLogoResponse> => {
    // This API doesn't follow the standard pattern, so we build the URL manually
    const url = '/api/method/chances_game.chances_game.customization.common.retrieve_filters_data.get_lead_user_logo';
    return api.get<GetLeadUserLogoResponse>(url);
};
