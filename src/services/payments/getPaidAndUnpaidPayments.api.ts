import { api } from '../api/apiClient';
import type { PaymentRecord } from '../../interfaces/payments/payments.types';

/**
 * @function get_paid_and_unpaid
 * @description
 * Retrieves a list of paid or unpaid payments based on the type parameter.
 *
 * @route
 * GET /api/method/chances_game.chances_game.doctype.prize_agreement.api.get_paid_and_unpaid
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @param {string} type - Payment type: 'paid' or 'unpaid'
 *
 * @returns {Object} response - Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Array<PaymentRecord>} response.data - Array of payment records.
 * @returns {string} response.message - Description of the API result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "id": "payment-1",
 *       "transactionId": "1234",
 *       "prizeAgreement": "Yes",
 *       "sponsorshipType": "Mobile Game",
 *       "amountPaid": 7500000,
 *       "outstanding": 0,
 *       "paymentMethod": "Bank transfer",
 *       "paymentStatus": "paid",
 *       "paymentDate": "2025-12-10",
 *       "category": "paid"
 *     }
 *   ],
 *   "message": "Payments retrieved successfully",
 *   "timestamp": "2025-11-30 08:00:00"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_paid_and_unpaid?type=paid' \
 * --header 'Authorization: token api_key:api_secret'
 */

export interface GetPaidAndUnpaidPaymentsParameters {
    type: 'paid' | 'unpaid';
    limit?: number;
    offset?: number;
    invoice_id?: string;
}

export interface GetPaidAndUnpaidPaymentsResponse {
    status: string;
    data: PaymentRecord[];
    message?: string;
    timestamp?: string;
    count?: number;
}

export const getPaidAndUnpaidPayments = async (parameters: GetPaidAndUnpaidPaymentsParameters): Promise<GetPaidAndUnpaidPaymentsResponse> => {
    const queryParameters = new URLSearchParams();
    queryParameters.append('type', parameters.type);

    if (parameters.limit !== undefined) {
        queryParameters.append('limit', parameters.limit.toString());
    }

    if (parameters.offset !== undefined) {
        queryParameters.append('offset', parameters.offset.toString());
    }

    if (parameters.invoice_id) {
        queryParameters.append('invoice_id', parameters.invoice_id);
    }

    // Build the full URL for this endpoint
    const url = `/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_paid_and_unpaid?${queryParameters.toString()}`;

    return api.get<GetPaidAndUnpaidPaymentsResponse>(url);
};
