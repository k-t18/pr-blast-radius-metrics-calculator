import { api, type ApiResponse } from '../api/apiClient';

/**
 * @function get_customer_count_by_target_audience
 * @description
 * Retrieves the customer count for a given target audience.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.target_audience.get_customer_count_by_target_audience
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @param {string} target_audience - The target audience value (e.g., "12-18")
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Object} response.data - Customer count data
 * @returns {Array<string>} response.data.audiences_used - List of audiences used
 * @returns {number} response.data.customer_count - The customer count
 * @returns {string} response.message - Message describing the result.
 * @returns {string} response.timestamp - Time at which the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "audiences_used": [],
 *     "customer_count": 7
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-02 14:37:30"
 * }
 */

export interface TotalAudienceReachResponse {
    audiences_used: string[];
    customer_count: number;
}

export interface GetTotalAudienceReachParameters {
    target_audience?: string;
}

export const getTotalAudienceReach = (parameters: GetTotalAudienceReachParameters) => {
    const { target_audience: targetAudience } = parameters;

    const queryParameters = new URLSearchParams();

    // Only add target_audience if it's provided
    if (targetAudience) {
        queryParameters.append('target_audience', targetAudience);
    }

    return api.get<ApiResponse<TotalAudienceReachResponse>>(
        `/api/method/chances_game.api.sponsor_api.v1.target_audience.get_customer_count_by_target_audience?${queryParameters.toString()}`
    );
};
