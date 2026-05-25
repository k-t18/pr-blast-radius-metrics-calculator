/**
 * @function create_palmpay_order
 * @description
 * Creates a PalmPay order for **multiple ERPNext documents** (Sales Invoice,
 * Sales Order, Prize Agreement, etc.) and initializes a bulk payment.
 *
 * Each document can have its own amount, while the total amount is charged
 * through PalmPay using a single reference.
 *
 * The API returns the PalmPay checkout URL, unique payment reference,
 * order status, and all linked documents.
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
 * ERPNext customer ID (e.g., `"CUST-2025-00005"`).
 *
 * @body {number} amount - Required.
 * Total payment amount in the smallest currency unit.
 *
 * @body {string} productType - Required.
 * PalmPay payment type (e.g., `"bank_transfer"`).
 *
 * @body {Array} documents - Required.
 * List of ERPNext documents included in the payment.
 *
 * @body {string} documents[].doctype - Required.
 * Document type (e.g., `"Sales Invoice"`).
 *
 * @body {string} documents[].docname - Required.
 * Document name/ID.
 *
 * @body {number} documents[].amount - Required.
 * Amount assigned to this document.
 *
 *
 * @returns {Object} Response object.
 * @returns {string} message.status - `"success"` or `"error"`.
 * @returns {string} message.message - Operation result.
 *
 * @returns {Object} message.data - PalmPay order details:
 * @returns {string} message.data.mockCheckoutUrl - PalmPay mock/live checkout link.
 * @returns {string} message.data.reference - Unique PalmPay order reference.
 * @returns {number} message.data.orderStatus - Status code from PalmPay.
 *
 * @returns {Array} message.data.documents - Documents linked to this payment.
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
 *       "mockCheckoutUrl": "https://checkout-daily.palmpay.com/h5-checkout/mock_test?countryCode=NG&payToken=A38356B2CAEB72850C3CF1E204DE5668&orderNo=24251208014118294375&payMethod=bank_transfer&signKey=708mWKXal6qEEx2_leN_ukfG5J4ZV0c1UUrvf-3rqpk&signSession=24251208014118294375&appId=L240927094612561496431&productType=bank_transfer",
 *       "reference": "24251208014118294375",
 *       "orderStatus": 1,
 *       "documents": [
 *         {
 *           "doctype": "Sales Invoice",
 *           "docname": "FIN-SI-25-0000023"
 *         },
 *         {
 *           "doctype": "Sales Invoice",
 *           "docname": "FIN-SI-25-0000051"
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
 *   "timestamp": "2025-12-08 01:41:12"
 * }
 *
 *
 * @example
 * // cURL Example (Bulk Payment):
 * curl --location 'http://127.0.0.1:8000/api/method/chances_payments.PalmPay_API.create_order.create_palmpay_order' \
 * --header 'Authorization: token b1a205e21ae870b:8dea546730704fd' \
 * --header 'Content-Type: application/json' \
 * --data '{
 *     "customer": "CUST-2025-00005",
 *     "amount": 2200,
 *     "productType": "bank_transfer",
 *     "documents": [
 *         {
 *             "doctype": "Sales Invoice",
 *             "docname": "FIN-SI-25-0000023",
 *             "amount": 900
 *         },
 *         {
 *             "doctype": "Sales Invoice",
 *             "docname": "FIN-SI-25-0000051",
 *             "amount": 300
 *         }
 *     ]
 * }'
 */

import { api } from '../api/apiClient';

export interface PalmPayDocument {
    doctype: string;
    docname: string;
    amount: number;
}

export interface PalmPayMultiPaymentParameters {
    customer: string;
    amount: number;
    productType: string;
    documents: PalmPayDocument[];
}

export interface PalmPayPaymentData {
    mockCheckoutUrl: string;
    reference: string;
    orderStatus: number;
    documents: PalmPayDocument[];
}

export interface PalmPayPaymentMessage {
    status: string;
    message: string;
    data: PalmPayPaymentData;
}

export interface PalmPayMultiPaymentResponse {
    message: PalmPayPaymentMessage;
}

export const palmPayMultiPayment = async (parameters: PalmPayMultiPaymentParameters): Promise<PalmPayMultiPaymentResponse> => {
    const url = '/api/method/chances_payments.PalmPay_API.create_order.create_palmpay_order';
    return api.post<PalmPayMultiPaymentResponse>(url, parameters);
};
