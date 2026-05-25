import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_sponsorship_intent
 * @description
 * Retrieves the list of available sponsorship intent options from the system.
 * These values represent various sponsorship visibility opportunities such as
 * branding, studio placement, financial support, and digital ad slots.
 * Intended to populate dropdown selections during sponsor registration.
 *
 * @route
 * POST /api/method/chances_game.api.sponsor_api.v1.registration.get_sponsorship_intent
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
 *       "name": "Mobile Weekly Leaderboard Branding",
 *       "label": "Mobile Weekly Leaderboard Branding"
 *     },
 *     {
 *       "name": "Studio Title",
 *       "label": "Studio Title"
 *     },
 *     {
 *       "name": "Mobile Gift Square",
 *       "label": "Mobile Gift Square"
 *     },
 *     {
 *       "name": "Mobile Ad Title",
 *       "label": "Mobile Ad Title"
 *     },
 *
 *
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-01 19:05:08"
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
 * curl --location 'http://127.0.0.1:8000/api/method/chances_game.api.sponsor_api.v1.registration.get_sponsorship_intent' \
 * --header 'Authorization: token b1a205e21ae870b:4351d6d59805f57' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 */
export const getSponsorshipIntentList = async (): Promise<ApiResponse<string[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getSponsorshipIntentList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<string[]>>(url);
};
