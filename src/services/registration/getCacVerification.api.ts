import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function verify_cac_number
 * @description
 * Verifies whether a provided CAC (Corporate Affairs Commission) registration number
 * is valid. The endpoint returns `true` if the number is valid, otherwise `false`.
 *
 * This API is commonly used during sponsor/organization registration to validate
 * the official business identification provided by the user.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.registration.verify_cac_number
 *
 * @queryParam {string} cac
 * The CAC number to be validated. Example: `RC100001`
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
 *   "data": true,
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-01 18:59:51"
 * }
 *
 * @response 400 - Bad Request
 * {
 *   "status": "error",
 *   "message": "CAC number is required"
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
 * curl --location 'http://127.0.0.1:8000/api/method/chances_game.api.sponsor_api.v1.registration.verify_cac_number?cac=RC100001' \
 * --header 'Authorization: token <api_key>:<api_secret>' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 *
 */
export const getCACVerification = async (cac: string): Promise<ApiResponse<boolean>> => {
    const { folder, file, function: methodName } = apiRegistry.getCACVerification;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<boolean>>(`${url}?cac=${cac}`);
};
