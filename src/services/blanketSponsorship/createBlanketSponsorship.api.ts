import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function create_blanket_from_portal
 * @description
 * Creates a new Blanket Sponsorship Order from the portal with details such as
 * sponsorship type, duration, allocation preferences, and budget rates.
 *
 * This endpoint is useful for submitting blanket sponsorship orders
 * where sponsors set a budget and timeframe without picking individual placements.
 *
 * @route
 * POST /api/method/chances_game.api.sponsor_api.v1.blanket_order.create_blanket_from_portal
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - The authentication token. Example: `token api_key:api_secret`
 * Content-Type - application/json
 *
 * @requires
 * API Body Parameters:
 * @param {string} sponsorship_type - Type of sponsorship ("Studio Show", "Mobile Game", or "Both")
 * @param {number} [studio_show_sponsor_ship_duration] - Duration in months for Studio Show (required if sponsorship_type includes Studio Show)
 * @param {number} [mobile_show_sponsor_ship_duration] - Duration in months for Mobile Game (required if sponsorship_type includes Mobile Game)
 * @param {string} [allocation_type] - Allocation preference ("chances" or "sponsor")
 * @param {string} [remarks] - Optional remarks or special preferences
 * @param {number} [studio_show_rate] - Budget/rate for Studio Show (required if sponsorship_type includes Studio Show)
 * @param {number} [mobile_show_rate] - Budget/rate for Mobile Game (required if sponsorship_type includes Mobile Game)
 *
 * @returns {Object} Response object
 * @returns {string} response.status - Indicates success or failure of the request.
 * @returns {Object} response.data - Created blanket order object.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} CreateBlanketOrderRequest
 * @property {string} sponsorship_type - Type of sponsorship ("Studio Show", "Mobile Game", or "Both")
 * @property {number} [studio_show_sponsor_ship_duration] - Duration in months for Studio Show
 * @property {number} [mobile_show_sponsor_ship_duration] - Duration in months for Mobile Game
 * @property {string} [allocation_type] - Allocation preference ("chances" or "sponsor")
 * @property {string} [remarks] - Optional remarks or special preferences
 * @property {number} [studio_show_rate] - Budget/rate for Studio Show
 * @property {number} [mobile_show_rate] - Budget/rate for Mobile Game
 *
 * @typedef {Object} BlanketOrder
 * @property {string} name - Unique ID of the Blanket Order.
 * @property {string} creation - Creation timestamp of the order.
 * @property {string} sponsorship_type - Type of sponsorship.
 * @property {string} status - Document status (e.g., Draft, Submitted).
 * @property {string} workflow_state - Current workflow progress state.
 *
 * @example
 * // Request Body:
 * {
 *   "sponsorship_type": "Studio Show",
 *   "studio_show_sponsor_ship_duration": 3,
 *   "mobile_show_sponsor_ship_duration": 3,
 *   "allocation_type": "chances",
 *   "remarks": "Special preferences",
 *   "studio_show_rate": 50000,
 *   "mobile_show_rate": 2000
 * }
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "name": "BLK-ORD-2025-00001",
 *     "creation": "2025-11-20 15:30:31.046025",
 *     "sponsorship_type": "Studio Show",
 *     "status": "Draft",
 *     "workflow_state": "Pending Review"
 *   },
 *   "message": "Blanket order created successfully",
 *   "timestamp": "2025-11-21 17:03:49"
 * }
 *
 * @example
 * // Error response
 * {
 *   "status": "error",
 *   "message": "Validation error: studio_show_rate is required for Studio Show sponsorship",
 *   "timestamp": "2025-11-24 12:04:25",
 *   "error_code": "VALIDATION_ERROR"
 * }
 *
 * cURL -
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.api.sponsor_api.v1.blanket_order.create_blanket_from_portal' \
 * --header 'Authorization: token 77c9baed11e27fd:7557e6e5d6f144d' \
 * --header 'Content-Type: application/json' \
 * --data '{
 *     "sponsorship_type": "Studio Show",
 *     "studio_show_sponsor_ship_duration": 3,
 *     "mobile_show_sponsor_ship_duration": 3,
 *     "allocation_type": "",
 *     "remarks": "",
 *     "studio_show_rate": 50000,
 *     "mobile_show_rate": 2000
 * }'
 */

export interface CreateBlanketOrderRequest {
    sponsorship_type: string;
    studio_show_sponsor_ship_duration?: string;
    mobile_show_sponsor_ship_duration?: string;
    allocation_type?: string;
    remarks?: string;
    studio_show_rate?: number;
    mobile_show_rate?: number;
    studio_start_date?: string;
    mobile_start_date?: string;
}

export interface BlanketOrder {
    name: string;
    creation: string;
    sponsorship_type: string;
    status: string;
    workflow_state: string;
}

export const createBlanketSponsorship = (data: CreateBlanketOrderRequest) => {
    const { folder, file, function: methodName } = apiRegistry.createBlanketOrder;
    const url = buildFrappeMethodURL(folder, file, methodName);

    return api.post<BlanketOrder>(`${url}`, data);
};
