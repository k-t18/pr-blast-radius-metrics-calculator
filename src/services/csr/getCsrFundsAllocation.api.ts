import type { CSRFundsAllocationResponse } from '../../interfaces/csr/fundsAllocation.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * @function get_fund_allocation
 * @description
 * Retrieves CSR fund allocation breakdown grouped by allocation category.
 * Useful for charts, CSR analytics dashboards, summary widgets and reporting.
 *
 * @route
 * GET https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_fund_allocation
 *
 * @authentication
 * Required — Authorization token must be provided.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates request result.
 * @returns {FundAllocationResponse} response.data - Allocation distribution data.
 * @returns {string} response.message - Response message from server.
 * @returns {string} response.timestamp - Time when response was generated.
 *
 * @typedef {Object} FundAllocationResponse
 * @property {Array<FundAllocationItem>} fundsAllocation - Category-wise allocation list.
 *
 * @typedef {Object} FundAllocationItem
 * @property {string} name - Allocation category (e.g., Education, Health).
 * @property {number} value - Percentage or value allocated to this category.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "fundsAllocation": [
 *       {
 *         "name": "Education",
 *         "value": 100.0
 *       }
 *     ]
 *   },
 *   "message": "Funds allocation data fetched successfully",
 *   "timestamp": "2025-12-06 23:39:42"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "You are not permitted to access this resource.",
 *   "timestamp": "2025-12-06 23:40:10",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_fund_allocation' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getCsrFundsAllocation = async (dateFormat?: number): Promise<ApiResponse<CSRFundsAllocationResponse>> => {
    const { folder, file, function: methodName } = apiRegistry.getCsrFundAllocationByFocusArea;
    const baseUrl = `/api/method/chances_game.chances_game.doctype.${folder}.${file}.${methodName}`;

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }
    const queryString = queryParameters.toString();
    const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<CSRFundsAllocationResponse>>(url);
};
