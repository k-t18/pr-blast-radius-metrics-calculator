import { api, type ApiResponse } from '../api/apiClient';

/**
 * @function get_base_rate
 * @description
 * Retrieves the base rate for a sponsorship campaign based on item code,
 * sponsorship objective, target audience, and budget.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.target_audience.get_base_rate
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @param {string} item_code - The item code for the sponsorship (e.g., "Ad Title Sponsorship")
 * @param {string} sponsorship_objective - The objective (e.g., "Visibility", "Engagement")
 * @param {string} target_audience - The target audience value (e.g., "12-18")
 * @param {number} budget - The budget amount
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Object} response.data - Base rate data
 * @returns {string} response.data.item_code - The item code
 * @returns {string} response.data.pricing_model - The pricing model (e.g., "CPM", "CPC")
 * @returns {number} response.data.old_base_rate - The old/base rate
 * @returns {number} response.data.new_base_rate - The new/updated rate
 * @returns {number} response.data.applied_percentage - Applied percentage
 * @returns {number} response.data.qty - Quantity
 * @returns {number} response.data.target_impressions - Target impressions
 * @returns {number} response.data.target_clicks - Target clicks
 * @returns {string} response.message - Message describing the result.
 * @returns {string} response.timestamp - Time at which the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "item_code": "Mobile Game Chance Square",
 *     "pricing_model": "CPM",
 *     "old_base_rate": 15.0,
 *     "new_base_rate": 15.6,
 *     "applied_percentage": 4.0,
 *     "qty": 3.2051282051282053,
 *     "target_impressions": 3205.128205128205,
 *     "target_clicks": 0
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-02 14:18:41"
 * }
 */

export interface BaseRateResponse {
    item_code: string;
    pricing_model: string;
    old_base_rate: number;
    new_base_rate: number;
    applied_percentage: number;
    qty: number;
    target_impressions: number;
    target_clicks: number;
}

export interface GetBaseRateParameters {
    item_code: string;
    sponsorship_objective: string;
    target_audience?: string;
    budget?: number;
}

export const getBaseRate = (parameters: GetBaseRateParameters) => {
    const { item_code: itemCode, sponsorship_objective: sponsorshipObjective, target_audience: targetAudience, budget } = parameters;

    // Universal formatting: decode item_code to ensure spaces instead of + signs
    // This handles both URL-encoded (%20) and form-encoded (+) formats
    const formattedItemCode = decodeURIComponent(itemCode.replaceAll('+', ' '));

    const queryParameters = new URLSearchParams({
        item_code: formattedItemCode,
        sponsorship_objective: sponsorshipObjective,
    });

    // Only add optional parameters if they exist
    if (targetAudience) {
        queryParameters.append('target_audience', targetAudience);
    }
    if (budget !== undefined) {
        queryParameters.append('budget', budget.toString());
    }

    return api.get<ApiResponse<BaseRateResponse>>(
        `/api/method/chances_game.api.sponsor_api.v1.target_audience.get_base_rate?${queryParameters.toString()}`
    );
};
