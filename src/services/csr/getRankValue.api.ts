import type { RankValue } from '../../interfaces/csr/rankValue.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';
/**
 * @function get_logged_in_customer_rank
 * @description
 * Fetches the CSR ranking of the currently logged-in customer based on total CSR contributions.
 * Useful for displaying leaderboards, customer dashboards, CSR badges, or rank achievements.
 *
 * @route
 * GET https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_logged_in_customer_rank
 *
 * @authentication
 * Required — active session/auth token must be provided.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {CSRRankResponse} response.data - Current customer's CSR rank information.
 * @returns {string} response.message - Server response message.
 * @returns {number} response.count - Total rows returned (always 1).
 * @returns {string} response.timestamp - Response generated timestamp.
 *
 * @typedef {Object} CSRRankResponse
 * @property {number} rank - Current CSR rank of logged in customer.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "rank": 1
 *   },
 *   "message": "Current customer CSR rank fetched successfully",
 *   "count": 1,
 *   "timestamp": "2025-12-07 08:32:57"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Unauthorized access",
 *   "timestamp": "2025-12-07 08:33:22",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_logged_in_customer_rank' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getRankValue = async (dateFormat?: number): Promise<ApiResponse<RankValue>> => {
    const { folder, file, function: methodName } = apiRegistry.getLoggedInCustomerRank;
    const baseUrl = `/api/method/chances_game.chances_game.doctype.${folder}.${file}.${methodName}`;

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }
    const queryString = queryParameters.toString();
    const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<RankValue>>(url);
};
