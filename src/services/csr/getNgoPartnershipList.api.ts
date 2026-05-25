import type { NGOPartnershipItem } from '../../interfaces/csr/ngoPartnershipList.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry } from '../api/apiRegistry';

/**
 * @function get_ngo_patnership
 * @description
 * Retrieves a paginated list of CSR NGO partnership records including details like:
 * - NGO Name
 * - CSR Amount
 * - Episode/Show reference (if applicable)
 * - CSR Document ID
 * - Focus Area (Education/Health/etc.)
 * - Paid Amount & Status (Pending/Completed)
 * - Certificate PDF download link
 *
 * Ideal for CSR dashboards, NGO reports, payment logs and certificate tracking views.
 *
 * @route
 * GET https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_ngo_patnership
 *
 * @authentication
 * Required — Authorization token must be included.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @param {number} [limit=10] - Records to fetch per request.
 * @param {number} [offset=0] - Starting index for pagination.
 *
 * @returns {Object} response
 * @returns {string} response.status - Success or failure.
 * @returns {Array<NGOPartnershipItem>} response.data - List of CSR partnership records.
 * @returns {number} response.count - Total number of active CSR donation entries.
 * @returns {string} response.message - Server message.
 * @returns {string} response.timestamp - Response time.
 *
 * @typedef {Object} NGOPartnershipItem
 * @property {string} ngo_name - NGO name / supplier code.
 * @property {number} csr_amount - CSR sponsorship/donation amount.
 * @property {string|null} episode - Linked episode or show id.
 * @property {string} name - CSR Donation Document ID.
 * @property {string|null} focus_area - Allocation category such as Education, Health, etc.
 * @property {number} paid_amount - Amount already paid out.
 * @property {string} status - "Pending" / "Completed"
 * @property {string} certificate - Downloadable CSR certificate PDF link.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "ngo_name": "SUP-2025-00002",
 *       "csr_amount": 4000.0,
 *       "episode": "1-episode_name",
 *       "name": "CSR-00022",
 *       "focus_area": null,
 *       "paid_amount": 4000.0,
 *       "status": "Completed",
 *       "certificate": "https://dev-chances.8848digitalerp.com/api/method/frappe.utils.print_format.download_pdf?doctype=CSR%20Donation&name=CSR-00022&format=Sponsor%20Donation"
 *     },
 *     {
 *       "ngo_name": "SUP-2025-00002",
 *       "csr_amount": 4000.0,
 *       "episode": "1-episode_name",
 *       "name": "CSR-00021",
 *       "focus_area": null,
 *       "paid_amount": 0,
 *       "status": "Pending",
 *       "certificate": "https://dev-chances.8848digitalerp.com/api/method/frappe.utils.print_format.download_pdf?doctype=CSR%20Donation&name=CSR-00021&format=Sponsor%20Donation"
 *     }
 *   ],
 *   "message": "CSR NGO partnerships fetched successfully",
 *   "count": 24,
 *   "timestamp": "2025-12-07 08:24:22"
 * }
 *
 * @example
 * // Error
 * {
 *   "status": "error",
 *   "message": "Permission denied.",
 *   "timestamp": "2025-12-07 08:25:03",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.csr_donation.api.get_ngo_patnership?limit=10&offset=1' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getNgoPartnershipList = async (limit: number = 10, offset: number = 0): Promise<ApiResponse<NGOPartnershipItem[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getNgoPartnershipList;
    const url = `/api/method/chances_game.chances_game.doctype.${folder}.${file}.${methodName}?limit=${limit}&offset=${offset}`;
    return api.get<ApiResponse<NGOPartnershipItem[]>>(url);
};
