import { api } from '../api/apiClient';

/**
 * @function get_period
 * @description
 * Retrieves a list of available period options for blanket sponsorship orders.
 *
 * This endpoint is useful for fetching period options for duration dropdowns
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.blanket_order.get_period
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
 * @returns {Array<Object>} response.data - List of period option objects.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} PeriodOption
 * @property {string} name - Period name (e.g., "30", "60", "90", "12 Months", "09 Months", etc.).
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "30"
 *     },
 *     {
 *       "name": "60"
 *     },
 *     {
 *       "name": "90"
 *     },
 *     {
 *       "name": "12 Months"
 *     },
 *     {
 *       "name": "09 Months"
 *     },
 *     {
 *       "name": "06 Months"
 *     },
 *     {
 *       "name": "03 Months"
 *     }
 *   ],
 *   "message": "Sponsorship periods fetched successfully",
 *   "count": 7,
 *   "timestamp": "2025-12-02 18:37:54"
 * }
 *
 * cURL -
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.api.sponsor_api.v1.blanket_order.get_period' \
 * --header 'Authorization: token 77c9baed11e27fd:7557e6e5d6f144d'
 */
export interface PeriodOption {
    name: string;
    label: string;
}

export interface PeriodResponse {
    status: string;
    data: PeriodOption[];
    message?: string;
    timestamp?: string;
    count?: number;
}

export const getPeriod = () => api.get<PeriodResponse>('/api/method/chances_game.api.sponsor_api.v1.blanket_order.get_period');
