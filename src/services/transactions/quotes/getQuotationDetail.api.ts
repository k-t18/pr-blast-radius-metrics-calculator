import type { Quote } from '../../../interfaces/quotes/quotes.types';
import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';

/**
 * @function get_quotation_details
 * @description
 * Retrieves detailed information for a specific Quotation using its
 * unique quotation ID. The response includes quotation metadata along with
 * all associated items.
 *
 * @route 
 * GET /api/method/chances_game.api.transactions_api.quotation.get_quotation_details
 *
 * @authentication 
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @queryparam 
 * id - quotation ID.
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Object} response.data - Quotation details.
 * @returns {string} response.data.name - Quotation ID.
 * @returns {string} response.data.creation - Timestamp when the quotation was created.
 * @returns {number} response.data.grand_total - Total amount of the quotation.
 * @returns {string} response.data.status - Document status (e.g., Draft, Ordered).
 * @returns {string} response.data.workflow_state - Workflow progress state.
 * @returns {Array<Object>} response.data.items - List of item rows inside the quotation.
 *
 * @typedef {Object} QuotationItem
 * @property {string} name - Unique row ID of the item.
 * @property {string} item_code - Item code of the product.
 * @property {string} item_name - Name of the product.
 * @property {number} qty - Quantity of the item.
 * @property {string|null} customer_item_code - Customer-specific item code.
 * @property {string|null} custom_episode - Associated episode (if any).
 * @property {string|null} custom_sponsorship_objective - Sponsorship objective (if any).
 * @property {string|null} custom_sponsorship_category - Sponsorship category.
 * @property {number} rate - Rate of the item.
 * @property {string} parent - Parent quotation ID.
 *
 * @returns {string} response.message - Message describing the result.
 * @returns {string} response.timestamp - Time at which the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "name": "SAL-QTN-2025-00001",
 *     "creation": "2025-11-20 14:53:43.835391",
 *     "grand_total": 12000.0,
 *     "status": "Draft",
 *     "workflow_state": "Pending for Approval",
 *     "items": [
 *       {
 *         "name": "b9uq3j0ghs",
 *         "item_code": "Studio Braniac Square",
 *         "item_name": "Studio Braniac Square",
 *         "qty": 1.0,
 *         "customer_item_code": null,
 *         "custom_episode": null,
 *         "custom_sponsorship_objective": null,
 *         "custom_sponsorship_category": "Financial Support",
 *         "rate": 12000.0,
 *         "parent": "SAL-QTN-2025-00001"
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-24 12:05:56"
 * }
 * 
 * @example
 * // Error Response:
 * {
    "status": "error",
    "message": "Quotation 'SAL-QTN-2025-0000123' not found",
    "timestamp": "2025-11-24 12:22:27",
    "error_code": "NOT_FOUND"
*  }
 */

export const getQuotationDetail = (quoteId: string) => {
    const { folder, file, function: methodName } = apiRegistry.quotationDetail;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<Quote>>(`${url}?id=${quoteId}`);
};
