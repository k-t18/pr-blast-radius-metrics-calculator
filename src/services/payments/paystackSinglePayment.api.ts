import { api } from '../api/apiClient';

/**
 * @function initiate_paystack_payment
 * @description
 * Initializes a Paystack payment for a given document (e.g., Sales Invoice)
 * and customer. It generates an authorization URL and a unique transaction
 * reference which can be used to redirect the user to Paystack's checkout page.
 *
 * This endpoint links the payment initialization to a specific ERPNext document
 * such as Sales Invoice, Sales Order, or any other supported doctype.
 *
 * @route
 * POST /api/method/chances_payments.PayStack_API.initiate.initiate_paystack_payment
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * The authentication token. Example: `token api_key:api_secret`
 *
 * @header {string} Content-Type
 * Must be `application/json`
 *
 * @body {string} email - Required. Customer's email address.
 * @body {number} amount - Required. Payment amount (Paystack expects amount in kobo).
 * @body {string} customer - Required. ERPNext Customer ID.
 * @body {string} doctype - Required. Linked document type (example: "Sales Invoice").
 * @body {string} docname - Required. Linked document name/ID.
 *
 * @returns {Object} Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Object} response.data - Contains Paystack payment init details.
 * @returns {string} response.data.authorization_url - URL for Paystack payment checkout.
 * @returns {string} response.data.reference - Unique Paystack transaction reference.
 * @returns {string} response.message - Message describing the result.
 *
 * @typedef {Object} PaystackInitResponse
 * @property {string} authorization_url - URL to redirect user for payment.
 * @property {string} reference - Paystack transaction reference ID.
 *
 * @example
 * // Successful Response:
 * {
 *   "message": {
 *     "status": "success",
 *     "message": "Initialized",
 *     "data": {
 *       "authorization_url": "https://checkout.paystack.com/tuepkup1a7xojiz",
 *       "reference": "mes5gbm8ul"
 *     }
 *   }
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "doctype is required",
 *   "timestamp": "2025-12-07 11:26:10",
 *   "error_code": "VALIDATION_ERROR"
 * }
 *
 * @example
 * // cURL Example:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_payments.PayStack_API.initiate.initiate_paystack_payment' \
 * --header 'Authorization: token b1a205e21ae870b:1416798bd532760' \
 * --header 'Content-Type: application/json' \
 * --data-raw '{
 *     "email": "aarti@8848digital.com",
 *     "amount": 43000,
 *     "customer": "CUST-2025-00001",
 *     "doctype": "Sales Invoice",
 *     "docname": "FIN-SI-25-0000035"
 * }'
 */

export interface PaystackSinglePaymentParameters {
    email: string;
    amount: number; // Amount in kobo (smallest currency unit)
    customer: string; // ERPNext Customer ID
    doctype: string; // Document type (e.g., "Sales Invoice", "Prize Agreement")
    docname: string; // Document name/ID (e.g., "FIN-SI-25-0000035")
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

export interface PaystackSinglePaymentResponse {
    message: PaystackPaymentMessage;
}

export const paystackSinglePayment = async (parameters: PaystackSinglePaymentParameters): Promise<PaystackSinglePaymentResponse> => {
    const url = '/api/method/chances_payments.PayStack_API.initiate.initiate_paystack_payment';

    return api.post<PaystackSinglePaymentResponse>(url, parameters);
};
