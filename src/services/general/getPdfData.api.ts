import type { TermsAndConditionList } from '../../interfaces/common/termsAndCondition.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_terms_and_condition
 * @description
 * Retrieves all terms and condition documents for the Sponsor Portal.
 * This includes Privacy Policy and Terms and Conditions content.
 * Use this API to load legal documents on application startup or when displaying policy pages.
 *
 * @route
 * GET {{chances_staging_env}}/api/method/chances_game.api.sponsor_api.v1.terms_and_condition.get_terms_and_condition
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @requires
 * API Params - None
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {TermsAndConditionList} response.data - Array of terms and condition documents.
 * @returns {string} response.message - Result message from server.
 * @returns {string} response.timestamp - Response time.
 *
 * @typedef {Object} TermsAndConditionItem
 * @property {string} name - Document name/title (e.g., "Privacy Policy - Sponsor Portal").
 * @property {string} terms - HTML content of the terms.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "Privacy Policy - Sponsor Portal",
 *       "terms": "<div class=\"ql-editor read-mode\"><p>Content to be added</p></div>"
 *     },
 *     {
 *       "name": "Terms and Conditions - Portal",
 *       "terms": "<div class=\"ql-editor read-mode\"><p>Content to be added</p></div>"
 *     }
 *   ],
 *   "message": "Terms and condition docs data retrieved successfully",
 *   "timestamp": "2025-12-26 16:29:42"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Permission denied or terms not accessible",
 *   "timestamp": "2025-12-26 16:30:00",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location '{{chances_staging_env}}/api/method/chances_game.api.sponsor_api.v1.terms_and_condition.get_terms_and_condition' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getTermsAndCondition = async (): Promise<ApiResponse<TermsAndConditionList>> => {
    const { folder, file, function: methodName } = apiRegistry.getTermsAndCondition;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<TermsAndConditionList>>(url);
};
