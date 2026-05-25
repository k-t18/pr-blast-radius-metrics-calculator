import type { PrizeAgreementDataTableTypes } from '../../../interfaces/prizeAgreement/prizeAgreement.types';
import { api, type ApiResponse } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';

export interface GetPrizeAgreementListParameters {
    limit?: number;
    offset?: number;
    id?: string;
    quotation_id?: string;
    sales_order?: string;
}

/**
 * @function get_prize_agreement_list
 * @description
 * Retrieves a paginated list of Prize Agreements.
 * Each record contains basic information such as:
 * - Prize Agreement ID
 * - Linked Sales Order (if available)
 * - Sponsor
 * - Sponsorship Type (Studio Show / Mobile Game)
 * - Episode (optional)
 * - Creation timestamp
 *
 * Use this API to show list views of prize agreements in dashboard,
 * sponsor portal, internal panels, or audit trails.
 *
 * @route
 * GET {{chances_staging_env}}/api/method/chances_game.api.transactions_api.prize_agreement.get_prize_agreement_list
 *
 * @authentication
 * Required — provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @param {number} [limit=10] - Number of records to fetch per request.
 * @param {number} [offset=0] - Number of records to skip (for pagination).
 * @param {string} [id] - Filter by Prize Agreement ID.
 * @param {string} [quotation_id] - Filter by Quotation ID.
 * @param {string} [sales_order] - Filter by Sales Order ID.
 *
 * @returns {Object} response
 * @returns {string} response.status - API execution status (success/error).
 * @returns {Array<PrizeAgreementItem>} response.data - Prize Agreement result list.
 * @returns {number} response.count - Total number of prize agreements in system.
 * @returns {string} response.message - Status message.
 * @returns {string} response.timestamp - Server response time.
 *
 * @typedef {Object} PrizeAgreementItem
 * @property {string} name - Prize Agreement ID.
 * @property {string|null} sales_order - Sales Order linked with the agreement.
 * @property {string} sponsor - Sponsor/customer reference.
 * @property {string} sponsorship_type - Studio Show / Mobile Game.
 * @property {string|null} episode - Episode reference (if exists).
 * @property {string} creation - Creation datetime.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "PA-000230",
 *       "sales_order": "SAL-SO-25-0000065",
 *       "sponsor": "CUST-2025-00003",
 *       "sponsorship_type": "Studio Show",
 *       "episode": null,
 *       "creation": "2025-12-06 22:35:19.375918"
 *     },
 *     {
 *       "name": "PA-000229",
 *       "sales_order": "SAL-SO-25-0000065",
 *       "sponsor": "CUST-2025-00003",
 *       "sponsorship_type": "Studio Show",
 *       "episode": null,
 *       "creation": "2025-12-06 20:23:47.737201"
 *     }
 *   ],
 *   "message": "Prize agreement list retrieved successfully",
 *   "count": 65,
 *   "timestamp": "2025-12-06 22:35:25"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Not permitted to access",
 *   "timestamp": "2025-12-06 22:36:10",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location '{{chances_staging_env}}/api/method/chances_game.api.transactions_api.prize_agreement.get_prize_agreement_list?limit=10&offset=0' \
 * --header 'Authorization: token api_key:api_secret'
 */
export const getPrizeAgreementList = async (parameters?: GetPrizeAgreementListParameters): Promise<ApiResponse<PrizeAgreementDataTableTypes[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getPrizeAgreementList;
    const url = buildFrappeMethodURL(folder, file, methodName);

    const searchParameters = new URLSearchParams();
    if (parameters?.limit !== undefined) searchParameters.append('limit', String(parameters.limit));
    if (parameters?.offset !== undefined) searchParameters.append('offset', String(parameters.offset));
    if (parameters?.id) searchParameters.append('id', parameters.id);
    if (parameters?.quotation_id) searchParameters.append('quotation_id', parameters.quotation_id);
    if (parameters?.sales_order) searchParameters.append('sales_order', parameters.sales_order);

    const queryString = searchParameters.toString();
    return api.get<ApiResponse<PrizeAgreementDataTableTypes[]>>(`${url}${queryString ? `?${queryString}` : ''}`);
};
