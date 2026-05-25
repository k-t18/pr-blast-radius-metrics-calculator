import type { SalesOrderWithItems } from '../../interfaces/prizeAgreement/prizeAgreement.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_sales_orders_list_with_items_requiring_creatives
 * @description
 * Retrieves a list of Sales Orders that contain items requiring creatives upload.
 * This API is useful for:
 * - Creative submission workflow
 * - Sponsor dashboard listing
 * - Pending creatives approval queue
 * - Identifying ordered items awaiting creative assets
 *
 * Supports limit, offset & type filters for pagination and segregation.
 *
 * @route
 * GET {{chances_staging_env}}/api/method/chances_game.api.transactions_api.sales_order.get_sales_orders_list_with_items_requiring_creatives?limit={limit}&offset={offset}&type={type}
 *
 * @authentication
 * Required — Authorization token must be passed in headers.
 *
 * @query {number} [limit=10] - Number of records per page.
 * @query {number} [offset=0] - Records to skip for pagination.
 * @query {string} [type] - Optional filter (e.g. `studio-show`, `mobile-game`).
 *
 * @header {string}
 * Authorization - Format: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Request execution status.
 * @returns {Array<SalesOrderCreativeItem>} response.data - Array of sales orders with items.
 * @returns {string} response.message - Response message.
 * @returns {number} response.count - Total matching records.
 * @returns {string} response.timestamp - Response timestamp.
 *
 * @typedef {Object} SalesOrderCreativeItem
 * @property {string} name - Sales Order ID.
 * @property {string} creation - Timestamp of Sales Order creation.
 * @property {number} grand_total - Total value of Sales Order.
 * @property {string} status - Document status (e.g. Draft, To Deliver).
 * @property {number} items_count - Total number of items in Sales Order.
 * @property {Array<ItemRequiringCreative>} items_with_status - Items requiring creatives upload.
 *
 * @typedef {Object} ItemRequiringCreative
 * @property {string} name - Item row ID.
 * @property {string} item_code - Linked ERP Item code.
 * @property {string} item_name - Item title.
 * @property {number} qty - Quantity ordered.
 * @property {string} sponsor_item_name - Sponsor facing label/name.
 * @property {number} rate - Item rate.
 * @property {string} parent - Parent Sales Order.
 * @property {string|null} custom_sponsorship_category - Sponsorship category.
 * @property {string|null} custom_sequence - Slot number (if exists).
 * @property {number|null} custom_declared_reward_amount - Reward/creative value declared.
 * @property {0|1} is_creative_required - Indicates that creative upload is required.
 *
 * @example
 * // Response Example:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "SAL-SO-25-0000064",
 *       "creation": "2025-12-05 14:19:44.587361",
 *       "grand_total": 16800.0,
 *       "status": "To Deliver and Bill",
 *       "items_count": 1,
 *       "items_with_status": [
 *         {
 *           "name": "5r6e49mmiv",
 *           "item_code": "Weekly Leaderboard",
 *           "item_name": "Weekly Leaderboard",
 *           "qty": 1.0,
 *           "sponsor_item_name": "Weekly Leaderboard",
 *           "rate": 16800.0,
 *           "parent": "SAL-SO-25-0000064",
 *           "custom_sponsorship_objective": "Visibility",
 *           "custom_sponsorship_category": "Mobile Weekly Leaderboard Branding",
 *           "custom_declared_reward_amount": 50000.0,
 *           "is_creative_required": 1
 *         }
 *       ]
 *     }
 *   ],
 *   "message": "Sales order with items requiring creatives list retrieved successfully",
 *   "count": 2,
 *   "timestamp": "2025-12-07 12:25:08"
 * }
 *
 * @example
 * // cURL:
 * curl --location '{{chances_staging_env}}/api/method/chances_game.api.transactions_api.sales_order.get_sales_orders_list_with_items_requiring_creatives?limit=10&offset=0&type=studio-show' \
 * --header 'Authorization: token api_key:api_secret'
 */
export const getSalesOrderWithCreativesItems = async (
    limit = 10,
    offset = 0,
    type?: 'studio-show' | 'mobile-game'
): Promise<ApiResponse<SalesOrderWithItems[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getSalesOrderWithItemsRequiringCreativesList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const typeQuery = type ? `&type=${type}` : '';

    return api.get<ApiResponse<SalesOrderWithItems[]>>(`${url}?limit=${limit}&offset=${offset}${typeQuery}`);
};
