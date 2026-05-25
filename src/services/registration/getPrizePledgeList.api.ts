import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_prize_pledge
 * @description
 * Retrieves a list of prize pledge options that sponsors can commit to during registration.
 * These values represent the type of reward (cash, gift items, vouchers, etc.) the sponsor
 * intends to offer for the show or campaign.
 *
 * @route
 * POST /api/method/chances_game.api.sponsor_api.v1.registration.get_prize_pledge
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
 *       "name": "Cash Reward",
 *       "label": "Cash Reward"
 *     },
 *     {
 *       "name": "Gift Reward",
 *       "label": "Gift Reward"
 *     },
 *     {
 *       "name": "Voucher/Coupons",
 *       "label": "Voucher/Coupons"
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-01 19:09:02"
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
 * curl --location 'http://127.0.0.1:8000/api/method/chances_game.api.sponsor_api.v1.registration.get_prize_pledge' \
 * --header 'Authorization: token b1a205e21ae870b:4351d6d59805f57' \
 * --header 'Cookie: full_name=Guest; sid=Guest; system_user=no; user_id=Guest; user_image='
 */

export const getPrizePledgeList = async (): Promise<ApiResponse<string[]>> => {
    const { folder, file, function: methodName } = apiRegistry.getPrizePledgeList;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<string[]>>(url);
};
