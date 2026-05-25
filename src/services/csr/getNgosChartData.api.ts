import type { NGOChartData } from '../../interfaces/csr/ngosChartData.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * @function fetch_ngo_wise_total_donation
 * @description
 * Retrieves NGO-wise CSR donation distribution summary.
 * Useful for bar charts, reports, analytics pages, and dashboards.
 *
 * Returns:
 * - List of NGOs with total allocated donation amount
 * - yAxisDomain values, useful for setting upper & lower chart bounds
 *
 * @route
 * GET https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.fetch_ngo_wise_total_donation
 *
 * @authentication
 * Required — Authorization header must be sent.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {NGOWiseDonationResponse} response.data - Donation summary grouped by NGOs.
 * @returns {string} response.message - Description of the data fetched.
 * @returns {string} response.timestamp - Server execution time.
 *
 * @typedef {Object} NGOWiseDonationResponse
 * @property {Array<NGODonationItem>} ngoDonations - List of NGO donations.
 * @property {[number, number]} yAxisDomain - Graph lower & upper range for donation visualization.
 *
 * @typedef {Object} NGODonationItem
 * @property {string} name - NGO Name or Identifier.
 * @property {number} donation - Total donation amount contributed to the NGO.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "ngoDonations": [
 *       { "name": "Lagos Food Bank Initiative", "donation": 150300.0 },
 *       { "name": "SUP-2025-00002", "donation": 26000.0 },
 *       { "name": "NGO00005", "donation": 10000.0 },
 *       { "name": "NGO00004", "donation": 5000.0 }
 *     ],
 *     "yAxisDomain": [0, 150300.0]
 *   },
 *   "message": "NGO-wise total donation fetched successfully.",
 *   "timestamp": "2025-12-06 23:41:07"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Not Authorized.",
 *   "timestamp": "2025-12-06 23:41:30",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.fetch_ngo_wise_total_donation' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getNgosChartData = async (dateFormat?: number): Promise<ApiResponse<NGOChartData>> => {
    const { folder, file, function: methodName } = apiRegistry.getNgoWiseTotalDonation;
    const baseUrl = `/api/method/chances_game.chances_game.doctype.${folder}.${file}.${methodName}`;

    const queryParameters = new URLSearchParams();
    if (dateFormat !== undefined) {
        queryParameters.append('date_format', String(dateFormat));
    }
    const queryString = queryParameters.toString();
    const url = `${baseUrl}${queryString ? `?${queryString}` : ''}`;

    return api.get<ApiResponse<NGOChartData>>(url);
};
