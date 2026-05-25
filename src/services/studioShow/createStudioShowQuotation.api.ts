import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function create_quotation
 * @description
 * Creates a new Quotation document in the system based on the provided JSON payload.
 * This API supports creating quotations with item details including episode, sponsorship
 * category, square location, reward amount, and payment terms. It returns the created
 * quotation ID along with a detailed response structure.
 *
 * @route
 * POST /api/method/chances_game.api.transactions_api.quotation.create_quotation
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * Authentication token. Example: `token api_key:api_secret`
 *
 * @header {string} Content-Type
 * Must be `application/json`
 *
 * @body {Object} payload - JSON body containing quotation details.
 * @body {number} payload.docstatus - Document status (0 = draft).
 * @body {string} payload.quotation_to - Recipient type (e.g., "Customer").
 * @body {string} payload.party_name - Name of the customer/party.
 * @body {string} payload.company - Company under which the quotation is created.
 * @body {string} payload.currency - Currency code (e.g., "NGN").
 * @body {string} payload.tc_name - Terms & Conditions name.
 * @body {string} payload.customer_group - Customer group.
 * @body {string} payload.doctype - Must be `"Quotation"`.
 * @body {number} payload.has_unit_price_items - Flag for unit price usage.
 * @body {Array<QuotationItem>} payload.items - List of items in the quotation.
 *
 * @typedef {Object} QuotationItem
 * @property {string} item_code - Unique item identifier.
 * @property {string} item_name - Display name of the item.
 * @property {string} item_group - Item group name.
 * @property {number} qty - Quantity.
 * @property {number} rate - Unit rate.
 * @property {string} custom_episode - Associated episode reference.
 * @property {string} custom_sponsorship_category - Sponsorship category.
 * @property {string} custom_square - Square or slot reference.
 * @property {number} custom_sequence - Sequence number of the item.
 * @property {number} custom_row - Row number for positioning.
 * @property {number} custom_declared_reward_amount - Declared reward value.
 * @property {string} custom_payment_terms_template - Payment terms.
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Object} response.data - Contains detailed creation response.
 * @returns {string} response.data.status - Success indicator from backend logic.
 * @returns {string} response.data.message - Confirmation message.
 * @returns {string} response.data.quotation - Generated quotation name/ID.
 * @returns {string} response.message - Overall request processing message.
 * @returns {string} response.timestamp - Time of API response.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "status": "success",
 *     "message": "Quotation created successfully",
 *     "quotation": "SAL-QTN-25-0000060"
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-26 11:51:13"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "party_name is required",
 *   "timestamp": "2025-11-26 12:00:11",
 *   "error_code": "VALIDATION_ERROR"
 * }
 *
 * @example
 * // cURL Example
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.api.transactions_api.quotation.create_quotation' \
 * --header 'Authorization: token b1a205e21ae870b:86aa7df82ceb6cd' \
 * --header 'Content-Type: application/json' \
 * --data '{
 *   "docstatus": 0,
 *   "quotation_to": "Customer",
 *   "party_name": "Grant Plastics Ltd.",
 *   "company": "Tantalizers Plc (Demo)",
 *   "has_unit_price_items": 0,
 *   "currency": "NGN",
 *   "tc_name": "Sponsorship Terms",
 *   "customer_group": "Demo Customer Group",
 *   "doctype": "Quotation",
 *   "items": [
 *     {
 *       "item_code": "Title Sponsorship",
 *       "item_name": "Title Sponsorship",
 *       "item_group": "Studio Show Sponsorship",
 *       "qty": 1,
 *       "rate": 10000,
 *       "custom_episode": "1-1-Battle of Brains",
 *       "custom_sponsorship_category": "Studio Title",
 *       "custom_square": "1-11-5-Gift",
 *       "custom_sequence": 1,
 *       "custom_row": 2,
 *       "custom_declared_reward_amount": 100,
 *       "custom_payment_terms_template": "180 Days"
 *     }
 *   ]
 * }'
 */

export interface CreateStudioShowQuotationItem {
    item_code: string;
    item_name: string;
    item_group: string;
    qty: number;
    rate: number | undefined;
    custom_episode?: string;
    custom_sponsorship_category?: string;
    custom_square?: string;
    custom_sequence?: number;
    custom_row?: number;
    custom_declared_reward_amount?: number;
    blanket_order: string;
    against_blanket_order: number;
}

export interface CreateStudioShowQuotationPayload {
    game_format: string;
    items: CreateStudioShowQuotationItem[];
    blanket_order: string;
}

export interface CreateStudioShowQuotationResponse {
    status: string;
    message: string;
    quotation: string;
}

export const createStudioShowQuotation = (payload: CreateStudioShowQuotationPayload) => {
    const { folder, file, function: methodName } = apiRegistry.createQuotation;
    const url = buildFrappeMethodURL(folder, file, methodName);

    return api.post<CreateStudioShowQuotationResponse>(url, payload);
};
