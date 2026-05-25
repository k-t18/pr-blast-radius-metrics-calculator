import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_sponsorship_focus_area
 * @description
 * Fetches a list of available CSR/Sponsorship focus areas from the system.
 * These values are typically used to populate dropdowns or selection fields
 * during sponsor registration.
 *
 * @route
 * POST /api/method/chances_game.api.sponsor_api.v1.registration.get_sponsorship_focus_area
 *
 * @authentication
 * Required - Valid API token must be provided
 *
 * @header {string} Authorization
 * Format: token <api_key>:<api_secret>
 *
 * @header {string} Cookie
 * Used for session-level guest authorization (optional)
 *
 * @requestBody
 * (Empty body accepted)
 *
 * @response 200 - Success
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "Healthcare",
 *       "label": "Healthcare"
 *     },
 *     {
 *       "name": "Education",
 *       "label": "Education"
 *     },
 *     {
 *       "name": "Clean Energy and Climate Action",
 *       "label": "Clean Energy and Climate Action"
 *     },
 *     ...
 *     {
 *       "name": "Health and Wellbeing",
 *       "label": "Health and Wellbeing"
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-01 19:04:40"
 * }
 *
 * @response 401 - Unauthorized
 * {
 *   "status": "error",
 *   "message": "Invalid or missing token"
 * }
 *
 * @response 500 - Internal Server Error
 * {
 *   "status": "error",
 *   "message": "Unexpected error occurred"
 * }
 *
 * @example cURL
 * curl --location 'http://127.0.0.1:8000/api/method/chances_game.api.sponsor_api.v1.registration.get_sponsorship_focus_area' \
 * --header 'Authorization: token b1a205e21ae870b:4351d6d59805f57' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 *
 */

export const getSponsorshipFocusAreaList = async (): Promise<ApiResponse<string[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getSponsorshipFocusAreaList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<string[]>>(url);
};
