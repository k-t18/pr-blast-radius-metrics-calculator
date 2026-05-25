/**
 * @function create_palmpay_order
 * @description
 * Creates a PalmPay payment order for a specific ERPNext document
 * (Sales Invoice, Sales Order, Prize Agreement, etc.) and initializes a payment.
 *
 * Returns the PalmPay mock/live checkout URL, unique payment reference,
 * order status, and linked document information.
 *
 * This endpoint is used to redirect the customer to PalmPay's
 * payment checkout page.
 *
 *
 * @route
 * POST /api/method/chances_payments.PalmPay_API.create_order.create_palmpay_order
 *
 *
 * @authentication
 * Required – Provide Authorization token in headers.
 *
 * @header {string} Authorization
 * Format: `token api_key:api_secret`
 *
 * @header {string} Content-Type
 * Must be: `application/json`
 *
 *
 * @body {string} doctype - Required.
 * ERPNext document type (e.g., `"Sales Invoice"`, `"Sales Order"`, `"Prize Agreement"`).
 *
 * @body {string} docname - Required.
 * Document name/ID (e.g., `"FIN-SI-25-0000062"`).
 *
 * @body {string} productType - Required.
 * PalmPay payment method (e.g., `"bank_transfer"`).
 *
 * @body {string} customer - Required.
 * Customer ID from ERPNext.
 *
 * @body {number} amount - Required.
 * Payment amount in smallest currency unit.
 *
 *
 * @returns {Object} Response object.
 * @returns {string} message.status - `"success"` or `"error"`.
 * @returns {string} message.message - Operation result description.
 *
 * @returns {Object} message.data - PalmPay order details.
 * @returns {string} message.data.mockCheckoutUrl - PalmPay mock/live checkout URL.
 * @returns {string} message.data.reference - Unique PalmPay order reference.
 * @returns {number} message.data.orderStatus - PalmPay order status code.
 * @returns {Array} message.data.documents - Linked ERPNext documents.
 * @returns {string} message.data.documents[].doctype - Document type.
 * @returns {string} message.data.documents[].docname - Document name.
 *
 *
 * @example
 * // Successful Response:
 * {
 *   "message": {
 *     "status": "success",
 *     "message": "Payment initiated",
 *     "data": {
 *       "mockCheckoutUrl": "https://checkout-daily.palmpay.com/h5-checkout/mock_test?countryCode=NG&payToken=44B41106ACFC2D18012E94B603B90993&orderNo=24251208012948205463&payMethod=bank_transfer&signKey=P975UB-c2bEiDbpoajbHa2HfvNH9gOG242gScoeF1oI&signSession=24251208012948205463&appId=L240927094612561496431&productType=bank_transfer",
 *       "reference": "24251208012948205463",
 *       "orderStatus": 1,
 *       "documents": [
 *         {
 *           "doctype": "Sales Invoice",
 *           "docname": "FIN-SI-25-0000062"
 *         }
 *       ]
 *     }
 *   }
 * }
 *
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Invalid Customer",
 *   "error_code": "VALIDATION_ERROR",
 *   "timestamp": "2025-12-08 01:12:55"
 * }
 *
 *
 * @example
 * // cURL Example:
 * curl --location 'http://127.0.0.1:8000/api/method/chances_payments.PalmPay_API.create_order.create_palmpay_order' \
 * --header 'Authorization: token b1a205e21ae870b:8dea546730704fd' \
 * --header 'Content-Type: application/json' \
 * --data '{
 *     "doctype": "Sales Invoice",
 *     "docname": "FIN-SI-25-0000062",
 *     "productType": "bank_transfer",
 *     "customer": "CUST-2025-00012",
 *     "amount": 810
 * }'
 */

import { api } from '../api/apiClient';

export interface PalmPayDocument {
    doctype: string;
    docname: string;
    amount?: number;
}

export interface PalmPaySinglePaymentParameters {
    doctype: string;
    docname: string;
    productType: string;
    customer: string;
    amount: number;
    documents?: PalmPayDocument[];
}

export interface PalmPayPaymentData {
    mockCheckoutUrl: string;
    reference: string;
    orderStatus: number;
    documents?: PalmPayDocument[];
}

export interface PalmPayPaymentMessage {
    status: string;
    message: string;
    data: PalmPayPaymentData;
}

export interface PalmPaySinglePaymentResponse {
    message: PalmPayPaymentMessage;
}

export const palmPaySinglePayment = async (parameters: PalmPaySinglePaymentParameters): Promise<PalmPaySinglePaymentResponse> => {
    const url = '/api/method/chances_payments.PalmPay_API.create_order.create_palmpay_order';
    return api.post<PalmPaySinglePaymentResponse>(url, parameters);
};
