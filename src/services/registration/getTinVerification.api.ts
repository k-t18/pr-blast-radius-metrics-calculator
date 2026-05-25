import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function verify_tin_number
 * @description
 * Validates a provided TIN (Taxpayer Identification Number).
 * The endpoint returns `true` if the TIN is valid, otherwise `false`.
 *
 * This API is used during company registration to verify tax compliance information.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.registration.verify_tin_number
 *
 * @queryParam {string} tin
 * The TIN number to be validated.
 * Example: `08120451-1001`
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * The authentication token.
 * Example: `token <api_key>:<api_secret>`
 *
 * @header {string} Cookie
 * Optional. Used when session-based authentication is active.
 *
 * @response 200 - Success
 * {
 *   "status": "success",
 *   "data": true,
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-01 19:00:56"
 * }
 *
 * @response 400 - Bad Request
 * {
 *   "status": "error",
 *   "message": "TIN number is required"
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
 * curl --location '{{chances_staging_env}}/api/method/chances_game.api.sponsor_api.v1.registration.verify_tin_number?tin=08120451-1001' \
 * --header 'Authorization: token <api_key>:<api_secret>' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 *
 */

export const getTINVerification = async (tin: string): Promise<ApiResponse<boolean>> => {
    const { folder, file, function: methodName } = apiRegistry.getTINVerification;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<boolean>>(`${url}?tin=${tin}`);
};
