import { api } from '../api/apiClient';

/**
 * @function get_report_data_query
 * @description
 * Retrieves report data query for prize agreements.
 *
 * @route
 * GET /api/method/chances_game.chances_game.doctype.prize_agreement.api.get_report_data_query
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @header {string}
 * Cookie - Example: `full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=; sid=Guest`
 *
 * @returns {Object} response - Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {unknown} response.data - Report data query result.
 * @returns {string} response.message - Description of the API result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @example
 * // cURL:
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_report_data_query' \
 * --header 'Authorization: token 77c9baed11e27fd:7557e6e5d6f144d' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=; sid=Guest'
 */

export interface CreditData {
    customer: string;
    customer_name: string;
    credit_limit: number;
    outstanding_amt: number;
    credit_balance: number;
    bypass_credit_check_at_sales_order: number;
    is_frozen: number;
    disabled: number;
}

export interface GetCreditAmountResponse {
    status: string;
    data: CreditData[];
    message?: string;
    count?: number;
    timestamp?: string;
}

export const getCreditAmount = async (): Promise<GetCreditAmountResponse> => {
    const url = '/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_report_data_query';

    return api.get<GetCreditAmountResponse>(url);
};
