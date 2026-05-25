import type { Quote } from '../../../interfaces/quotes/quotes.types';
import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';
/**
 * @function get_quotations_list
 * @description
 * Retrieves a list of all Quotations with their key details such as
 * name, creation timestamp, grand total, document status, and workflow state.
 *
 * This endpoint is useful for fetching all quotations list 
 * 
 * @route 
 * GET /api/method/chances_game.api.transactions_api.quotes.get_quotations_list
 *
 * @authentication 
 * Required – provide Authorization token in headers.
 *
 * @header {string} 
 * Authorization - The authentication token. Example: `token api_key:api_secret`
 * 
 * @requires
 * API Params - None
 *
 * @returns {Object} Response object
 * @returns {string} response.status - Indicates success or failure of the request.
 * @returns {Array<Object>} response.data - List of quotation objects.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} Quotation
 * @property {string} name - Unique ID of the Sales Quotation.
 * @property {string} creation - Creation timestamp of the quotation.
 * @property {number} grand_total - Grand total amount.
 * @property {string} status - Document status (e.g., Draft, Ordered).
 * @property {string} workflow_state - Current workflow progress state.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "SAL-QTN-2025-00003",
 *       "creation": "2025-11-20 15:30:31.046025",
 *       "grand_total": 100000.0,
 *       "status": "Ordered",
 *       "workflow_state": "Approved"
 *     },
 *     {
 *       "name": "SAL-QTN-2025-00002",
 *       "creation": "2025-11-20 15:28:43.083887",
 *       "grand_total": 100000.0,
 *       "status": "Ordered",
 *       "workflow_state": "Approved"
 *     },
 *     {
 *       "name": "SAL-QTN-2025-00001",
 *       "creation": "2025-11-20 14:53:43.835391",
 *       "grand_total": 12000.0,
 *       "status": "Draft",
 *       "workflow_state": "Pending for Approval"
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-21 17:03:49"
 * }
 * 
 * @example
 * // Error response
 * {
    "status": "error",
    "message": "frappe.exceptions.PermissionError: You are not permitted to access this resource. Login to accessFunction chances_game.api.transactions_api.quotation.get_quotations_list is not whitelisted.",
    "timestamp": "2025-11-24 12:04:25",
    "error_code": "PERMISSION_DENIED"
*  }
*/

export interface GetQuotationsListParameters {
    id?: string;
    type?: string;
    limit?: number;
    offset?: number;
}

export interface GetQuotationsListResponse extends ApiResponse<Quote[]> {
    count: number;
}

export const getQuotationsList = (parameters?: GetQuotationsListParameters) => {
    const queryParameters = new URLSearchParams();
    if (parameters?.id) {
        queryParameters.append('id', parameters.id);
    }
    if (parameters?.type) {
        queryParameters.append('type', parameters.type);
    }
    if (parameters?.limit !== undefined) {
        queryParameters.append('limit', String(parameters.limit));
    }
    if (parameters?.offset !== undefined) {
        queryParameters.append('offset', String(parameters.offset));
    }
    const queryString = queryParameters.toString();

    const { folder, file, function: methodName } = apiRegistry.quotationsList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;
    return api.get<GetQuotationsListResponse>(endpoint);
};
