import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_blanket_order
 * @description
 * Retrieves a list of all Blanket Orders with their key details such as
 * name, creation timestamp, budget, start date, duration, and status.
 *
 * This endpoint is useful for fetching all blanket orders list
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.blanket_order.get_blanket_order
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
 * @returns {Array<Object>} response.data - List of blanket order objects.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} BlanketOrderListItem
 * @property {string} name - Unique ID of the Blanket Order.
 * @property {string} creation - Creation timestamp of the order.
 * @property {number} grand_total - Total budget amount.
 * @property {string} status - Document status (e.g., Draft, Submitted).
 * @property {string} workflow_state - Current workflow progress state (e.g., Approved, Pending Review, Rejected).
 * @property {string} [start_date] - Start date of the sponsorship.
 * @property {number} [duration] - Duration in months.
 * @property {string} [remarks] - Remarks or rejection reason.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "BLK-ORD-2025-00001",
 *       "creation": "2025-11-20 15:30:31.046025",
 *       "grand_total": 145000000.0,
 *       "status": "Submitted",
 *       "workflow_state": "Approved",
 *       "start_date": "2025-10-12",
 *       "duration": 2
 *     },
 *     {
 *       "name": "BLK-ORD-2025-00002",
 *       "creation": "2025-11-20 15:28:43.083887",
 *       "grand_total": 145000000.0,
 *       "status": "Submitted",
 *       "workflow_state": "Pending Review",
 *       "start_date": "2025-10-12",
 *       "duration": 2
 *     },
 *     {
 *       "name": "BLK-ORD-2025-00003",
 *       "creation": "2025-11-20 14:53:43.835391",
 *       "grand_total": 145000000.0,
 *       "status": "Submitted",
 *       "workflow_state": "Rejected",
 *       "start_date": "2025-10-12",
 *       "duration": 2,
 *       "remarks": "Budget exceeds available slots"
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-21 17:03:49"
 * }
 *
 * @example
 * // Error response
 * {
 *   "status": "error",
 *   "message": "frappe.exceptions.PermissionError: You are not permitted to access this resource.",
 *   "timestamp": "2025-11-24 12:04:25",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * cURL -
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.api.sponsor_api.v1.blanket_order.get_blanket_order' \
 * --header 'Authorization: token 77c9baed11e27fd:7557e6e5d6f144d'
 */

export interface BlanketOrderListItem {
    id: string;
    created_on: string;
    start_date: string;
    duration: string;
    status: string;
    remarks: string | null;
    rate: number;
}

export interface GetBlanketOrderListParameters {
    id?: string;
    limit?: number;
    offset?: number;
    status?: string;
}

export interface BlanketOrderListResponse {
    status: string;
    data: BlanketOrderListItem[];
    message?: string;
    timestamp?: string;
    count?: number;
}

export const getBlanketOrderList = (parameters?: GetBlanketOrderListParameters) => {
    const queryParameters = new URLSearchParams();
    if (parameters?.id) {
        queryParameters.append('id', parameters.id);
    }
    if (parameters?.limit !== undefined) {
        queryParameters.append('limit', parameters.limit.toString());
    }
    if (parameters?.offset !== undefined) {
        queryParameters.append('offset', parameters.offset.toString());
    }
    if (parameters?.status) {
        queryParameters.append('status', parameters.status);
    }

    const { folder, file, function: methodName } = apiRegistry.blanketOrderList;
    const url = buildFrappeMethodURL(folder, file, methodName);

    const queryString = queryParameters.toString();
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;
    return api.get<BlanketOrderListResponse>(endpoint);
};
