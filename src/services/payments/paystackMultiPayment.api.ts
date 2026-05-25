/**
 * @function initiate_paystack_payment
 * @description
 * Initializes a Paystack payment for one or multiple ERPNext documents
 * (Sales Invoice, Sales Order, Prize Agreement, etc.) and generates a
 * Paystack checkout URL.
 *
 * Supports **bulk document payments**, where each document can have
 * its own amount, and the total is charged to Paystack using a single
 * reference.
 *
 * This endpoint is used to redirect the user to Paystack's hosted
 * payment page to complete the transaction.
 *
 * @route
 * POST /api/method/chances_payments.PayStack_API.initiate.initiate_paystack_payment
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
 * @body {string} email - Required.
 * Customer email address to create Paystack transaction.
 *
 * @body {number} amount - Required.
 * Total amount to charge (in **smallest currency unit**, e.g., kobo).
 *
 * @body {string} customer - Required.
 * ERPNext Customer ID (e.g., `"CUST-2025-00011"`).
 *
 * @body {Array} documents - Required.
 * List of documents included in the payment.
 *
 * @body {string} documents[].doctype - Required.
 * The ERPNext Document Type
 * (e.g., `"Sales Invoice"`, `"Sales Order"`, `"Prize Agreement"`).
 *
 * @body {string} documents[].docname - Required.
 * ID/Name of the document.
 *
 * @body {number} documents[].amount - Required.
 * Amount applied to this document.
 *
 *
 * @returns {Object} Response object
 * @returns {string} message.status - `"success"` or `"error"`.
 * @returns {string} message.message - Operation result text.
 * @returns {Object} message.data - Paystack payment details.
 * @returns {string} message.data.authorization_url - URL to redirect customer.
 * @returns {string} message.data.reference - Unique Paystack transaction ref.
 *
 *
 * @example
 * // Successful Response:
 * {
 *   "message": {
 *     "status": "success",
 *     "message": "Initialized",
 *     "data": {
 *       "authorization_url": "https://checkout.paystack.com/iasc65tvr3y0tpw",
 *       "reference": "mvsjpb7k9z"
 *     }
 *   }
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Invalid Customer",
 *   "error_code": "VALIDATION_ERROR",
 *   "timestamp": "2025-12-08 12:22:40"
 * }
 *
 *
 * @example
 * // cURL Example:
 * curl --location 'http://127.0.0.1:8000/api/method/chances_payments.PayStack_API.initiate.initiate_paystack_payment' \
 * --header 'Authorization: token b1a205e21ae870b:8dea546730704fd' \
 * --header 'Content-Type: application/json' \
 * --data-raw '{
 *     "email": "aarti@8848digital.com",
 *     "amount": 2000,
 *     "customer": "CUST-2025-00011",
 *     "documents": [
 *         {
 *             "doctype": "Sales Invoice",
 *             "docname": "FIN-SI-25-0000061",
 *             "amount": 500
 *         },
 *         {
 *             "doctype": "Sales Invoice",
 *             "docname": "FIN-SI-25-0000060",
 *             "amount": 600
 *         },
 *         {
 *             "doctype": "Prize Agreement",
 *             "docname": "PA-000206",
 *             "amount": 1000
 *         }
 *     ]
 * }'
 */

import { api } from '../api/apiClient';

export interface PaystackDocument {
    doctype: string;
    docname: string;
    amount: number;
}

export interface PaystackMultiPaymentParameters {
    email: string;
    amount: number;
    customer: string;
    documents: PaystackDocument[];
}

export interface PaystackPaymentData {
    authorization_url: string;
    reference: string;
}

export interface PaystackPaymentMessage {
    status: string;
    message: string;
    data: PaystackPaymentData;
}

export interface PaystackMultiPaymentResponse {
    message: PaystackPaymentMessage;
}

export const paystackMultiPayment = async (parameters: PaystackMultiPaymentParameters): Promise<PaystackMultiPaymentResponse> => {
    const url = '/api/method/chances_payments.PayStack_API.initiate.initiate_paystack_payment';

    return api.post<PaystackMultiPaymentResponse>(url, parameters);
};
