import type { InvoiceRecord } from '../../../interfaces/invoices/invoices.types';
import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';
/**
 * @function get_sales_invoices_list
 * @description
 * Retrieves a list of Sales Invoices with their key metadata such as invoice ID,
 * creation timestamp, grand total, payment status, and workflow state.
 *
 * Use this endpoint to fetch an overview of all Sales Invoices in the system.
 *
 * @route
 * GET /api/method/chances_game.api.transactions_api.sales_invoice.get_sales_invoices_list
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header {string}
 * Authorization - Authentication token. Example: `<token>`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure of the request.
 * @returns {Array<Object>} response.data - List of Sales Invoice entries.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} SalesInvoice
 * @property {string} name - Unique Sales Invoice ID (e.g., ACC-SINV-2025-00001).
 * @property {string} creation - Timestamp when the invoice was created.
 * @property {number} grand_total - Total value of the invoice.
 * @property {string} status - Invoice status (e.g., Unpaid, Paid, Overdue).
 * @property {string|null} workflow_state - Workflow approval state, if applicable.
 *
 * @example
 * // Sample Success Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "ACC-SINV-2025-00001",
 *       "creation": "2025-11-21 12:06:00.447060",
 *       "grand_total": 100000.0,
 *       "status": "Unpaid",
 *       "workflow_state": null
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-21 17:03:57"
 * }
 */

export interface GetInvoicesListParameters {
    id?: string;
    order_id?: string;
    quotation_id?: string;
    type?: string;
    limit?: number;
    offset?: number;
}

export interface GetInvoicesListResponse extends ApiResponse<InvoiceRecord[]> {
    count: number;
}

export const getInvoicesList = (parameters?: GetInvoicesListParameters) => {
    const queryParameters = new URLSearchParams();
    if (parameters?.id) {
        queryParameters.append('id', parameters.id);
    }
    if (parameters?.order_id) {
        queryParameters.append('order_id', parameters.order_id);
    }
    if (parameters?.quotation_id) {
        queryParameters.append('quotation_id', parameters.quotation_id);
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
    const { folder, file, function: methodName } = apiRegistry.invoicesList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;

    return api.get<GetInvoicesListResponse>(endpoint);
};
