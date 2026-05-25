import type { OrderRecord } from '../../../interfaces/orders/orders.types';
import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';

/**
 * @function get_sales_order_details
 * @description
 * Retrieves detailed information about a specific Sales Order using its unique
 * order ID. The response includes core sales order information such as creation
 * timestamp, grand total amount, document status, linked quotation ID,
 * prize-agreement availability, and all associated item rows.
 *
 * @route 
 * GET /api/method/chances_game.api.transactions_api.sales_order.get_sales_order_details
 *
 * @authentication 
 * Required — provide Authorization token in headers.
 *
 * @header {string} 
 * Authorization - Authentication token. Example: `<token>`
 *
 * @queryparam {string} 
 * id - Unique identifier of the Sales Order.
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Object} response.data - Detailed Sales Order object.
 * @returns {string} response.data.name - Sales Order ID.
 * @returns {string} response.data.creation - Timestamp when the Sales Order was created.
 * @returns {number} response.data.grand_total - Total amount of the order.
 * @returns {string} response.data.status - Document status (e.g., To Deliver, To Deliver and Bill).
 * @returns {string} response.data.quotation_id - Linked Quotation ID.
 * @returns {0|1} response.data.is_prize_agreement_available - Indicates whether a prize agreement exists.
 * @returns {Array<Object>} response.data.items - Array of associated item rows.
 *
 * @typedef {Object} SalesOrderItem
 * @property {string} name - Internal row identifier.
 * @property {string} item_code - Item code of the product.
 * @property {string} item_name - Name of the product.
 * @property {number} qty - Quantity of the item.
 * @property {string|null} customer_item_code - Customer’s item code (if any).
 * @property {string|null} custom_episode - Associated episode (if provided).
 * @property {string|null} custom_sponsorship_objective - Sponsorship objective.
 * @property {string|null} custom_sponsorship_category - Sponsorship category.
 * @property {number} rate - Price per unit.
 * @property {string} parent - Parent Sales Order ID.
 *
 * @returns {string} response.message - Message describing the API result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @example
 * // Example Success Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "name": "SAL-ORD-2025-00002",
 *     "creation": "2025-11-20 15:31:47.741382",
 *     "grand_total": 100000.0,
 *     "status": "To Deliver",
 *     "is_prize_agreement_available": 0,
 *     "quotation_id": "SAL-QTN-2025-00003",
 *     "items": [
 *       {
 *         "name": "1jl4bl05kj",
 *         "item_code": "Mobile Game Chance Square",
 *         "item_name": "Mobile Game Chance Square",
 *         "qty": 1.0,
 *         "customer_item_code": null,
 *         "custom_episode": null,
 *         "custom_sponsorship_objective": null,
 *         "custom_sponsorship_category": null,
 *         "rate": 100000.0,
 *         "parent": "SAL-ORD-2025-00002"
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-21 17:17:56"
 * }
 * 
 * @example
 * // Error Response:
 * {
    "status": "error",
    "message": "Sales Order ID is required",
    "timestamp": "2025-11-24 12:44:33",
    "error_code": "NOT_FOUND"
*  }
 */

export const getOrderDetail = (orderId: string) => {
    const { folder, file, function: methodName } = apiRegistry.salesOrderDetail;
    const url = buildFrappeMethodURL(folder, file, methodName);

    return api.get<ApiResponse<OrderRecord>>(`${url}?id=${orderId}`);
};
