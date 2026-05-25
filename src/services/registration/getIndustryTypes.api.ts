import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_industry_type
 * @description
 * Retrieves the complete list of industry types available in the system.
 * Each item returned contains:
 * - `name`: The internal name of the industry type.
 * - `label`: The display label of the industry type.
 *
 * This API is commonly used during sponsor/partner signup, business profiling,
 * or any form submission requiring selection of industry sectors.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.registration.get_industry_type
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * The authentication token.
 * Example: `token <api_key>:<api_secret>`
 *
 * @header {string} Cookie
 * Optional. Used if session-based authentication is enabled.
 *
 * @response 200 - Success
 * {
 *   "status": "success",
 *   "data": [
 *     { "name": "Venture Capital", "label": "Venture Capital" },
 *     { "name": "Transportation", "label": "Transportation" },
 *     { "name": "Television", "label": "Television" },
 *     ...
 *     { "name": "Accounting", "label": "Accounting" }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-01 18:54:51"
 * }
 *
 * @response 401 - Unauthorized
 * {
 *   "status": "error",
 *   "message": "Authentication failed"
 * }
 *
 * @response 500 - Internal Server Error
 * {
 *   "status": "error",
 *   "message": "An unexpected error occurred"
 * }
 *
 * @example cURL
 * curl --location 'http://127.0.0.1:8000/api/method/chances_game.api.sponsor_api.v1.registration.get_industry_type' \
 * --header 'Authorization: token <api_key>:<api_secret>' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 *
 */
export const getIndustryTypes = async (): Promise<ApiResponse<string[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getIndustryTypeList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<string[]>>(url);
};
