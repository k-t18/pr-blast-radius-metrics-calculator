import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';
import type { SalesOrderWithItems } from '../../../interfaces/prizeAgreement/prizeAgreement.types';
/**
 * @function get_sales_order_with_prize_agreement_items_list
 * @description
 * Retrieves a detailed list of Sales Orders along with their associated
 * prize-agreement-required items. Each sales order entry includes metadata such as:
 * - Sales Order ID
 * - Creation timestamp
 * - Grand total
 * - Document status
 * - Total number of items
 * - Array of items containing sponsorship and prize-agreement information
 *
 * Use this endpoint when you want to display Sales Orders where prize agreement items
 * must be validated, mapped, or processed further in your application.
 *
 * @route
 * GET /api/method/chances_game.api.transactions_api.sales_order.get_sales_order_with_prize_agreement_items_list
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @requires
 * API Params
 * - type: "studio-show" | "mobile-game" (filters orders by experience)
 *
 * @returns {Object} response - Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Array<Object>} response.data - Array of Sales Order entries.
 * @returns {string} response.message - Description of the API result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} SalesOrderWithItems
 * @property {string} name - Unique Sales Order ID.
 * @property {string} creation - Creation timestamp.
 * @property {number} grand_total - Total order value.
 * @property {string} status - Document status (e.g., Draft, To Deliver, Completed).
 * @property {number} items_count - Total number of items in the order.
 * @property {Array<PrizeAgreementItem>} items_with_status - Items that include sponsorship & prize agreement info.
 *
 * @typedef {Object} PrizeAgreementItem
 * @property {string} name - Item row identifier.
 * @property {string} item_code - ERPNext item code.
 * @property {string} item_name - Display name of the item.
 * @property {number} qty - Quantity.
 * @property {string} sponsor_item_name - Mapped sponsor label (from rulebook).
 * @property {number} rate - Rate/price of the item.
 * @property {string} parent - Parent Sales Order ID.
 * @property {string|null} custom_episode - Linked episode (if any).
 * @property {string|null} custom_sponsorship_category - Sponsorship category.
 * @property {string|null} custom_sequence - Slot/sequence number.
 * @property {string|null} custom_square_type - Type of square (Gift, Braniac, Vantage, etc.).
 * @property {number|null} custom_declared_reward_amount - Declared reward amount.
 * @property {0|1} is_prize_agreement_required - Whether a prize agreement is required for this item.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "SAL-SO-25-0000038",
 *       "creation": "2025-11-27 08:16:11.983268",
 *       "grand_total": 677250.0,
 *       "status": "Draft",
 *       "items_count": 4,
 *       "items_with_status": [
 *         {
 *           "name": "iqp28gdius",
 *           "item_code": "Studio Gift Square",
 *           "item_name": "Studio Gift Square",
 *           "qty": 2.0,
 *           "sponsor_item_name": "Square 1 - Gift",
 *           "rate": 10000.0,
 *           "parent": "SAL-SO-25-0000038",
 *           "custom_episode": "1-1-Battle of Brains",
 *           "custom_sponsorship_category": "Studio Gift Square",
 *           "custom_sequence": "1",
 *           "custom_square_type": "Gift",
 *           "custom_declared_reward_amount": 20000.0,
 *           "is_prize_agreement_required": 1
 *         }
 *       ]
 *     }
 *   ],
 *   "message": "Sales order with prize agreement items list retrieved successfully",
 *   "timestamp": "2025-11-27 08:21:47"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "frappe.exceptions.PermissionError: You are not permitted to access this resource.",
 *   "timestamp": "2025-11-27 10:12:01",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location '{{chances_staging_env}}/api/method/chances_game.api.transactions_api.sales_order.get_sales_order_with_prize_agreement_items_list?type=studio-show' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getSalesOrderWithPrizeAgreementItemsList = async (
    limit = 10,
    offset = 0,
    type?: 'studio-show' | 'mobile-game',
    orderId?: string
): Promise<ApiResponse<SalesOrderWithItems[]>> => {
    const { folder, file, function: methodName } = apiRegistry.salesOrdersWithPrizeAgreementItemsList;
    const url = buildFrappeMethodURL(folder, file, methodName);

    const queryParameters = new URLSearchParams();
    queryParameters.append('limit', String(limit));
    queryParameters.append('offset', String(offset));
    if (type) {
        queryParameters.append('type', type);
    }
    if (orderId) {
        queryParameters.append('id', orderId);
    }

    return api.get<ApiResponse<SalesOrderWithItems[]>>(`${url}?${queryParameters.toString()}`);
};
