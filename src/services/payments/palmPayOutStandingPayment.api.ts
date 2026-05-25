/**
 * @function create_palmpay_order
 * @description
 * Initializes a PalmPay payment **without linking any ERPNext documents**.
 *
 * This is used when the customer makes a standalone payment (e.g., wallet
 * top-up, manual payment, or custom charging scenario) where no documents
 * need to be attached.
 *
 * Returns the PalmPay mock/live checkout URL, a unique payment reference,
 * order status, and an empty documents array.
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
 * @body {string} customer - Required.
 * ERPNext customer ID (e.g., `"CUST-2025-00011"`).
 *
 * @body {number} amount - Required.
 * Total payment amount in the smallest currency unit.
 *
 * @body {string} productType - Required.
 * PalmPay payment type (e.g., `"bank_transfer"`).
 *
 * @body {Array} [documents] - Optional.
 * If not provided, the order is created without document associations.
 *
 *
 * @returns {Object} Response object.
 * @returns {string} message.status - `"success"` or `"error"`.
 * @returns {string} message.message - Operation message.
 *
 * @returns {Object} message.data - PalmPay order information.
 * @returns {string} message.data.mockCheckoutUrl - PalmPay checkout URL.
 * @returns {string} message.data.reference - Unique PalmPay reference.
 * @returns {number} message.data.orderStatus - PalmPay order status.
 * @returns {Array} message.data.documents - Empty array when no documents provided.
 *
 *
 * @example
 * // Successful Response (No Documents):
 * {
 *   "message": {
 *     "status": "success",
 *     "message": "Payment initiated",
 *     "data": {
 *       "mockCheckoutUrl": "https://checkout-daily.palmpay.com/h5-checkout/mock_test?countryCode=NG&payToken=A78BDF869C894E095BA86B2B041B0B89&orderNo=24251208012233400730&payMethod=bank_transfer&signKey=AjX4m4iqULRXUZw7sqNyEL_ZWQLNdDsmf_d1Fr_EyVY&signSession=24251208012233400730&appId=L240927094612561496431&productType=bank_transfer",
 *       "reference": "24251208012233400730",
 *       "orderStatus": 1,
 *       "documents": []
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
 *   "timestamp": "2025-12-08 01:22:10"
 * }
 *
 *
 * @example
 * // cURL Example (No Documents):
 * curl --location 'http://127.0.0.1:8000/api/method/chances_payments.PalmPay_API.create_order.create_palmpay_order' \
 * --header 'Authorization: token b1a205e21ae870b:8dea546730704fd' \
 * --header 'Content-Type: application/json' \
 * --data '{
 *     "customer": "CUST-2025-00011",
 *     "amount": 2100,
 *     "productType": "bank_transfer"
 * }'
 */

import { api } from '../api/apiClient';
import type { PalmPayDocument, PalmPayPaymentMessage } from './palmPayMultiPayment.api';

export interface PalmPayOutstandingPaymentParameters {
    customer: string;
    amount: number;
    productType: string;
    documents?: PalmPayDocument[];
}

export interface PalmPayOutstandingPaymentResponse {
    message: PalmPayPaymentMessage;
}

export const palmPayOutstandingPayment = async (parameters: PalmPayOutstandingPaymentParameters): Promise<PalmPayOutstandingPaymentResponse> => {
    const url = '/api/method/chances_payments.PalmPay_API.create_order.create_palmpay_order';
    return api.post<PalmPayOutstandingPaymentResponse>(url, parameters);
};
