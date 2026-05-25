import { api } from '../../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../../api/apiRegistry';

/**
 * @function create_prize_agreement
 * @description
 * Creates a prize agreement for a sales order with all associated items and rewards.
 * This endpoint submits the complete prize agreement form data including reward types,
 * quantities, prices, and handling instructions for each item.
 *
 * @route
 * POST /api/method/chances_game.api.transactions_api.prize_agreement.create_prize_agreement
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @param {PrizeAgreementSubmitData} payload - Prize agreement submission data
 * @param {string} payload.sponsorship_type - Type of sponsorship (e.g., "Studio Show", "Mobile Game")
 * @param {Array} payload.items_and_rewards - Array of items with their reward configurations
 * @param {string} payload.items_and_rewards[].sales_order_item - Sales order item ID
 * @param {string} payload.items_and_rewards[].rewardType - Type of reward (cash, gift, voucher-coupon, mix)
 * @param {string} payload.items_and_rewards[].description - Description of the reward
 * @param {number} payload.items_and_rewards[].quantity - Quantity of items
 * @param {number} payload.items_and_rewards[].unitRetailPrice - Unit retail price
 * @param {number} payload.items_and_rewards[].playersCount - Number of players (for cash rewards)
 * @param {string} payload.items_and_rewards[].startDate - Start date (for voucher/coupon)
 * @param {number} payload.items_and_rewards[].durationMonths - Duration in months (for voucher/coupon)
 * @param {string} payload.items_and_rewards[].unclaimedPrizesHandling - How to handle unclaimed prizes
 * @param {string} payload.items_and_rewards[].disbursementOwnership - Ownership (chances or sponsor)
 * @param {string} payload.items_and_rewards[].collectionInstructions - Instructions for winners
 *
 * @returns {Promise<Object>} response - Response object
 * @returns {string} response.status - Indicates success or failure
 * @returns {string} response.message - Description of the API result
 * @returns {Object} response.data - Created prize agreement data
 *
 * @example
 * // Request:
 * {
 *   "sponsorship_type": "Studio Show",
 *   "items_and_rewards": [
 *     {
 *       "sales_order_item": "me5uddq9o0",
 *       "rewardType": "gift",
 *       "description": "iPhone 15",
 *       "quantity": 2,
 *       "unitRetailPrice": 3500000,
 *       "playersCount": 0,
 *       "startDate": "",
 *       "durationMonths": 0,
 *       "unclaimedPrizesHandling": "carry-forward",
 *       "disbursementOwnership": "chances",
 *       "collectionInstructions": "Deliver to winner's address"
 *     }
 *   ]
 * }
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "message": "Prize agreement created successfully",
 *   "data": {
 *     "name": "PRIZE-AGREEMENT-00001",
 *     "creation": "2025-11-27 08:21:47"
 *   }
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Validation failed: Total reward value does not match declared amount",
 *   "error_code": "VALIDATION_ERROR"
 * }
 *
 * @example
 * // cURL:
 * curl --location 'http://localhost:8000/api/method/chances_game.api.transactions_api.prize_agreement.create_prize_agreement' \
 * --header 'Authorization: token b96e0154b0abc6b:8155e78207f95a2' \
 * --header 'Content-Type: application/json' \
 * --data '{
 *   "sponsorship_type": "Studio Show",
 *   "items_and_rewards": [...]
 * }'
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const createPrizeAgreement = async (payload: any): Promise<{ name: string; creation: string; message?: string }> => {
    const { folder, file, function: methodName } = apiRegistry.createPrizeAgreement;
    const url = buildFrappeMethodURL(folder, file, methodName);

    return api.post<{ name: string; creation: string; message?: string }>(url, payload);
};
