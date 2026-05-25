import type { OrderRecord } from '../../../interfaces/orders/orders.types';
import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';

/**
 * @function get_sales_orders_list
 * @description
 * Retrieves a list of Sales Orders with their key details including order ID,
 * creation timestamp, grand total amount, document status, linked quotation ID,
 * and whether a prize agreement is available for that order.
 *
 * @route
 * GET /api/method/chances_game.api.transactions_api.sales_order.get_sales_orders_list
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header {string}
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or error.
 * @returns {Array<Object>} response.data - List of Sales Order objects.
 * @returns {string} response.message - Descriptive message about the result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} SalesOrder
 * @property {string} name - Unique Sales Order ID (e.g., SAL-ORD-2025-00002).
 * @property {string} creation - Creation timestamp of the Sales Order.
 * @property {number} grand_total - Grand total amount of the order.
 * @property {string} status - Order status (e.g., To Deliver, To Deliver and Bill).
 * @property {string} quotation_id - Linked Quotation ID associated with the Sales Order.
 * @property {0|1} is_prize_agreement_available - Indicates if prize agreement exists (0 = No, 1 = Yes).
 *
 * @example
 * // Sample Success Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "SAL-ORD-2025-00002",
 *       "creation": "2025-11-20 15:31:47.741382",
 *       "grand_total": 100000.0,
 *       "status": "To Deliver",
 *       "quotation_id": "SAL-QTN-2025-00003",
 *       "is_prize_agreement_available": 0
 *     },
 *     {
 *       "name": "SAL-ORD-2025-00001",
 *       "creation": "2025-11-20 15:29:43.747549",
 *       "grand_total": 100000.0,
 *       "status": "To Deliver and Bill",
 *       "quotation_id": "SAL-QTN-2025-00002",
 *       "is_prize_agreement_available": 1
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-21 17:03:53"
 * }
 * 
 * @example
 * // Error Response:
 * {
    "status": "error",
    "message": "frappe.exceptions.PermissionError: You are not permitted to access this resource. Login to accessFunction chances_game.api.transactions_api.sales_order.get_sales_orders_list is not whitelisted.",
    "timestamp": "2025-11-24 12:36:16",
    "error_code": "PERMISSION_DENIED"
}
 */

export interface GetOrdersListParameters {
    id?: string;
    order_id?: string;
    type?: string;
    limit?: number;
    offset?: number;
}

export interface GetOrdersListResponse extends ApiResponse<OrderRecord[]> {
    count: number;
}

export const getOrdersList = (parameters?: GetOrdersListParameters) => {
    const queryParameters = new URLSearchParams();
    if (parameters?.id) {
        queryParameters.append('id', parameters.id);
    }
    if (parameters?.order_id) {
        queryParameters.append('order_id', parameters.order_id);
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

    const { folder, file, function: methodName } = apiRegistry.salesOrderList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;

    return api.get<GetOrdersListResponse>(endpoint);
};
