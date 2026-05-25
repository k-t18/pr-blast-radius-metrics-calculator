import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_country_list
 * @description
 * Retrieves the complete list of countries available in the system.
 * Each item returned contains:
 * - `name`: The internal name of the country.
 * - `label`: The display label of the country.
 *
 * This endpoint is typically used to populate country dropdowns during registration
 * or form submissions where country selection is required.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.registration.get_country_list
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * The authentication token. Example: `token <api_key>:<api_secret>`
 *
 * @header {string} Cookie
 * Optional. Used if session-based authentication is enabled.
 *
 * @response 200 - Success
 * {
 *   "status": "success",
 *   "data": [
 *     { "name": "India", "label": "India" },
 *     { "name": "United States", "label": "United States" },
 *     ...
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-01 18:52:24"
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
 * curl --location 'http://127.0.0.1:8000/api/method/chances_game.api.sponsor_api.v1.registration.get_country_list' \
 * --header 'Authorization: token <api_key>:<api_secret>' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 *
 */
export const getCountryList = async (): Promise<ApiResponse<string[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getCountryList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<string[]>>(url);
};
