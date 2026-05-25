import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';
import type { RankingList } from '../../interfaces/csr/rankList.types';

/**
 * @function get_customer_wise_paid_summary
 * @description
 * Retrieves customer-wise CSR paid amount summary along with their rank.
 * Useful for:
 * - CSR leaderboards
 * - Customer contribution comparison
 * - Gamification dashboards
 * - Sponsor CSR performance insights
 *
 * @route
 * GET https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_customer_wise_paid_summary
 *
 * @authentication
 * Required — Authorization header must be provided.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Request status.
 * @returns {Array<CustomerCSRSummary>} response.data - List of customers with donation summary.
 * @returns {string} response.message - Status description.
 * @returns {number} response.count - Total entries returned.
 * @returns {string} response.timestamp - Server response timestamp.
 *
 * @typedef {Object} CustomerCSRSummary
 * @property {string} sponsor_name - Customer/Sponsor identifier.
 * @property {number} amount_donated - Total CSR amount paid by sponsor.
 * @property {number} rank - CSR rank based on total contribution.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "sponsor_name": "CUST-2025-00001",
 *       "amount_donated": 61300.0,
 *       "rank": 1
 *     },
 *     {
 *       "sponsor_name": "CUST-2025-00002",
 *       "amount_donated": 500.0,
 *       "rank": 2
 *     }
 *   ],
 *   "message": "Sponsor-wise CSR paid amount summary fetched successfully",
 *   "count": 2,
 *   "timestamp": "2025-12-07 08:32:36"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Not authorized to access summary",
 *   "timestamp": "2025-12-07 08:33:10",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_customer_wise_paid_summary' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getRankingList = async (limit: number = 10, offset: number = 0): Promise<ApiResponse<RankingList>> => {
    const { folder, file, function: methodName } = apiRegistry.getRankList;
    const url = `/api/method/chances_game.chances_game.doctype.${folder}.${file}.${methodName}?limit=${limit}&offset=${offset}`;
    return api.get<ApiResponse<RankingList>>(url);
};
