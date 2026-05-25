/**
 * @function initiate_paystack_payment
 * @description
 * Initializes a Paystack payment for a given customer by generating
 * an authorization URL and unique transaction reference.
 * This endpoint is used before redirecting the user to Paystack's
 * checkout page to complete the payment.
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
 * @body {string} email - Required. Customer's email ID.
 * @body {number} amount - Required. Payment amount in kobo (Paystack format).
 * @body {string} customer - Required. Customer ID (ERPNext Customer record).
 *
 * @returns {Object} Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Object} response.data - Contains the Paystack initialization details.
 * @returns {string} response.data.authorization_url - URL to redirect user for payment.
 * @returns {string} response.data.reference - Paystack transaction reference.
 * @returns {string} response.message - Message describing the result.
 *
 * @example
 * // Successful Response:
 * {
 *   "message": {
 *     "status": "success",
 *     "message": "Initialized",
 *     "data": {
 *       "authorization_url": "https://checkout.paystack.com/ktm80olhglhbn8k",
 *       "reference": "q5tziymtuz"
 *     }
 *   }
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Customer not found",
 *   "error_code": "VALIDATION_ERROR",
 *   "timestamp": "2025-12-07 11:22:44"
 * }
 *
 * @example
 * // cURL Example:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_payments.PayStack_API.initiate.initiate_paystack_payment' \
 * --header 'Authorization: token b1a205e21ae870b:56bfe9bfc4d9425' \
 * --header 'Content-Type: application/json' \
 * --data-raw '{
 *     "email": "aarti@8848digital.com",
 *     "amount": 43000,
 *     "customer": "CUST-2025-00001"
 * }'
 */

import { api } from '../api/apiClient';

export interface PaystackOutstandingPaymentParameters {
    email: string;
    amount: number;
    customer: string;
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

export interface PaystackOutstandingPaymentResponse {
    message: PaystackPaymentMessage;
}

export const paystackOutstandingPayment = async (parameters: PaystackOutstandingPaymentParameters): Promise<PaystackOutstandingPaymentResponse> => {
    const url = '/api/method/chances_payments.PayStack_API.initiate.initiate_paystack_payment';

    return api.post<PaystackOutstandingPaymentResponse>(url, parameters);
};
