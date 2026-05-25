import type { CSRCardSummary } from '../../interfaces/csr/cardSummary.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * @function csr_card_details
 * @description
 * Retrieves CSR (Corporate Social Responsibility) summary metrics including:
 * - Total donation amount contributed through CSR entries
 * - Number of NGOs supported via CSR funds
 *
 * This API is useful for CSR dashboards, analytics cards, reporting widgets,
 * and sponsor portal CSR summary visibility.
 *
 * @route
 * GET https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.csr_card_details
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {CSRCardSummary} response.data - Consolidated CSR summary metrics.
 * @returns {string} response.message - Summary description.
 * @returns {string} response.timestamp - Server response time.
 *
 * @typedef {Object} CSRCardSummary
 * @property {number} total_donation - Total CSR donation amount.
 * @property {number} ngo_supported - Number of NGOs contributed through CSR.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "total_donation": 61300.0,
 *     "ngo_supported": 4
 *   },
 *   "message": "CSR Payment Entries fetched successfully",
 *   "timestamp": "2025-12-06 23:21:51"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Unauthorized access.",
 *   "timestamp": "2025-12-06 23:22:15",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.csr_card_details' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getCardsData = async (dateFormat?: number): Promise<ApiResponse<CSRCardSummary>> => {
    // const { folder, file, function: methodName } = apiRegistry.getCsrCardDetails;
    // const url = buildFrappeMethodURL(folder, file, methodName);
    // return api.get<ApiResponse<CSRCardSummary>>(url);
    const { folder, file, function: methodName } = apiRegistry.getCsrCardDetails;
    const baseUrl = `/api/method/chances_game.chances_game.doctype.${folder}.${file}.${methodName}`;

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }
    const queryString = queryParameters.toString();
    const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<CSRCardSummary>>(url);
};
