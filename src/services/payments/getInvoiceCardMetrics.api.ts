import { api } from '../api/apiClient';

/**
 * @function get_invoice_card_metrics
 * @description
 * Retrieves invoice card metrics including overdue, total paid, and unpaid invoices.
 *
 * @route
 * GET /api/method/chances_game.chances_game.doctype.prize_agreement.api.get_invoice_card_metrics
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @returns {Object} response - Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Array<Object>} response.data - Array of metric objects.
 * @returns {string} response.message - Description of the API result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "Overdue": 1
 *     },
 *     {
 *       "Total Paid": 397948.59
 *     },
 *     {
 *       "Unpaid Invoices": 0
 *     }
 *   ],
 *   "message": "Invoice metrics fetched successfully",
 *   "timestamp": "2025-12-03 12:11:15"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_invoice_card_metrics' \
 * --header 'Authorization: token api_key:api_secret'
 */

export interface InvoiceCardMetric {
    Overdue?: number;
    'Total Paid'?: number;
    'Unpaid Invoices'?: number;
}

export interface GetInvoiceCardMetricsResponse {
    status: string;
    data: InvoiceCardMetric[];
    message?: string;
    timestamp?: string;
}

export const getInvoiceCardMetrics = async (): Promise<GetInvoiceCardMetricsResponse> => {
    const url = '/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_invoice_card_metrics';

    return api.get<GetInvoiceCardMetricsResponse>(url);
};
