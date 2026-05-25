import { api } from '../api/apiClient';

/**
 * @function mobile_game_quotation
 * @description
 * Submits a mobile game quotation with campaign items.
 *
 * @route
 * POST /api/method/chances_game.api.sponsor_api.v1.quotation.mobile_game_quotation
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 * Content-Type - application/json
 *
 * @param {Object} quotationData - The quotation data
 * @param {number} quotationData.docstatus - Document status (1)
 * @param {string} quotationData.company - Company name
 * @param {string} quotationData.custom_game_format - Game format ("Mobile Game")
 * @param {string} quotationData.doctype - Document type ("Quotation")
 * @param {Array} quotationData.items - Array of quotation items
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Object} response.data - Quotation response data
 * @returns {string} response.message - Message describing the result.
 * @returns {string} response.timestamp - Time at which the response was generated.
 */

export interface CampaignDataItem {
    blanket_order: string;
    against_blanket_order: number;
    item_code: string;
    item_name: string;
    custom_sponsorship_objective?: string;
    custom_target_audience?: string;
    budget?: number;
    custom_start_date: string;
    custom_duration: string | number;
    custom_row?: string;
    custom_rank?: number;
    custom_square_type?: string;
    custom_declared_reward_amount?: string;
}

export interface CampaignDataRequest {
    docstatus: number;
    custom_game_format: string;
    doctype: string;
    blanket_order?: string;
    items: CampaignDataItem[];
}

export interface CampaignDataResponseData {
    status: string;
    message: string;
    quotation_name?: string;
}

export interface CampaignDataResponse {
    status: string;
    data?: CampaignDataResponseData;
    message: string;
    timestamp?: string;
}

export const postMobileGameCampaignData = (quotationData: CampaignDataRequest) => {
    return api.post<CampaignDataResponse>('/api/method/chances_game.api.sponsor_api.v1.quotation.mobile_game_quotation', quotationData);
};
