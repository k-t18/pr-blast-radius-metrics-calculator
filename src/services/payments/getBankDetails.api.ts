import { api } from '../api/apiClient';

/**
 * @function get_bank_details
 * @description
 * Retrieves bank details for payment processing.
 *
 * @route
 * GET /api/method/chances_game.chances_game.doctype.prize_agreement.api.get_bank_details
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @header {string}
 * Cookie - Example: `full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image=`
 *
 * @returns {Object} response - Response object
 * @returns {string} response.status - Indicates success or failure.
 * @returns {unknown} response.data - Bank details data.
 * @returns {string} response.message - Description of the API result.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @example
 * // cURL:
 * curl --location 'https://dev-chances.8848digitalerp.com/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_bank_details' \
 * --header 'Authorization: token 77c9baed11e27fd:7557e6e5d6f144d' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 */

export interface GetBankDetailsResponse {
    status: string;
    data: unknown;
    message?: string;
    timestamp?: string;
}

export const getBankDetails = async (): Promise<GetBankDetailsResponse> => {
    const url = '/api/method/chances_game.chances_game.doctype.prize_agreement.api.get_bank_details';

    return api.get<GetBankDetailsResponse>(url);
};
