import type { NGOItem } from '../../../interfaces/ngo/ngo.types';
import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';
/**
 * @function get_ngo_list
 * @description
 * Retrieves a list of NGOs (Non-Governmental Organizations) registered in the system.
 * Each NGO entry contains:
 * - NGO ID
 * - Supplier / Organization Name
 * - Contact Mobile Number
 * - Email ID
 *
 * This endpoint is used to populate NGO dropdown lists, mapping screens,
 * or any feature that requires listing NGO master data.
 *
 * @route
 * GET {{chances_staging_env}}/api/method/chances_game.api.v1.ngo.get_ngo_list
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @requires
 * API Params - Optional pagination:
 * @param {number} [limit=10] - Number of records to return.
 * @param {number} [offset=0] - Index to start fetching records from.
 *
 * @returns {Object} response - Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Array<NGOItem>} response.data - Array of NGO details.
 * @returns {string} response.message - Description of the API result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} NGOItem
 * @property {string} name - NGO ID (unique supplier/NGO code).
 * @property {string} supplier_name - Display name of the NGO.
 * @property {string|null} mobile_no - Mobile number of the NGO contact.
 * @property {string|null} email_id - Email ID of the NGO contact.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "SUP-2025-00004",
 *       "supplier_name": "Esigie Aguele",
 *       "mobile_no": null,
 *       "email_id": null
 *     },
 *     {
 *       "name": "NGO1",
 *       "supplier_name": "NGO1",
 *       "mobile_no": null,
 *       "email_id": null
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-02 10:05:42"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "frappe.exceptions.PermissionError: You are not permitted to access this resource.",
 *   "timestamp": "2025-12-02 10:10:15",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location '{{chances_staging_env}}/api/method/chances_game.api.v1.ngo.get_ngo_list' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getNGOsList = async (): Promise<ApiResponse<NGOItem[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getNGOsList;
    const url = buildFrappeMethodURL(folder, file, methodName);

    return api.get<ApiResponse<NGOItem[]>>(url);
};
