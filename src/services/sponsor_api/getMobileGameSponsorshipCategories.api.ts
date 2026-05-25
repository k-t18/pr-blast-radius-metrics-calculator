import { api } from '../api/apiClient';

/**
 * @function get_mobile_game_sponsorship_items
 * @description
 * Retrieves mobile game sponsorship items based on sponsorship type.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.target_audience.get_mobile_game_sponsorship_items
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @param {string} sponsorship_type - The sponsorship type (e.g., "run_campaigns", "sponsor_rewards", "both")
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Object} response.data - Sponsorship items data
 * @returns {Array} response.data.items - Array of sponsorship items
 * @returns {string} response.data.items[].name - The item name
 * @returns {string} response.data.items[].item_name - The item name (duplicate)
 * @returns {string} response.data.items[].custom_sponsorship_category - The category
 * @returns {string} response.data.items[].description - The description
 * @returns {number} response.data.items[].prize_agreement_required - Whether prize agreement is required (0 or 1)
 * @returns {number} response.data.items[].cpc_rate - CPC rate
 * @returns {number} response.data.items[].cpm_rate - CPM rate
 * @returns {string} response.message - Message describing the result.
 * @returns {string} response.timestamp - Time at which the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "items": [
 *       {
 *         "name": "Ad Title Sponsorship",
 *         "item_name": "Ad Title Sponsorship",
 *         "custom_sponsorship_category": "Mobile Ad Title",
 *         "description": "92494380",
 *         "prize_agreement_required": 0,
 *         "cpc_rate": 15.0,
 *         "cpm_rate": 10.0
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-02 14:17:34"
 * }
 */

export interface MobileGameSponsorshipItem {
    name: string;
    item_name: string;
    custom_sponsorship_category: string;
    description: string;
    prize_agreement_required: number;
    cpc_rate?: number;
    cpm_rate?: number;
}

export interface MobileGameSponsorshipItemsResponse {
    items: MobileGameSponsorshipItem[];
}

export interface GetMobileGameSponsorshipItemsParameters {
    sponsorship_type: 'run_campaigns' | 'sponsor_rewards' | 'both';
}

export const getMobileGameSponsorshipCategories = (parameters: GetMobileGameSponsorshipItemsParameters) => {
    const { sponsorship_type: sponsorshipType } = parameters;

    const queryParameters = new URLSearchParams({
        sponsorship_type: sponsorshipType,
    });

    return api.get<MobileGameSponsorshipItemsResponse>(
        `/api/method/chances_game.api.sponsor_api.v1.target_audience.get_mobile_game_sponsorship_items?${queryParameters.toString()}`
    );
};
