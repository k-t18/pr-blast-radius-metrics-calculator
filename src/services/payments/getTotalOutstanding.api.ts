import { api } from '../api/apiClient';

/**
 * @function get_total_outstanding
 * @description
 * Retrieves the total outstanding amount for payments.
 *
 * @route
 * GET /api/method/chances_game.chances_game.doctype.prize_agreement.api.get_total_outstanding
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response - Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {number} response.data - Total outstanding amount.
 * @returns {string} response.message - Description of the API result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": 32900000,
 *   "message": "Total outstanding amount retrieved successfully",
 *   "timestamp": "2025-11-30 08:00:00"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_total_outstanding' \
 * --header 'Authorization: token api_key:api_secret'
 */

export interface OutstandingData {
    customer: string;
    email: string;
    outstanding_amount: number;
}

export interface GetTotalOutstandingResponse {
    status: string;
    data: OutstandingData;
    message?: string;
    timestamp?: string;
}

export const getTotalOutstanding = async (): Promise<GetTotalOutstandingResponse> => {
    const url = '/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_total_outstanding';

    return api.get<GetTotalOutstandingResponse>(url);
};
