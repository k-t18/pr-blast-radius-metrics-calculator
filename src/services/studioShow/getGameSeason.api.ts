import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_game_season_list
 * @description
 * Retrieves a list of all available game seasons from the system.
 * Each season entry contains its identifier (name).
 * This API is useful for populating dropdowns or selection lists
 * where the user needs to select a game season.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.game_season.get_game_season_list
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * The authentication token. Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {Object} response.data - Core API output.
 * @returns {string} response.data.status - API-level response status.
 * @returns {Array<Object>} response.data.categories - List of game seasons.
 * @returns {string} response.data.categories[].name - Name/ID of the season.
 * @returns {string} response.message - Processing result message.
 * @returns {string} response.timestamp - Time when the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "status": "success",
 *     "categories": [
 *       {
 *         "name": "3"
 *       },
 *       {
 *         "name": "1"
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-26 12:23:11"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Database connection failure",
 *   "timestamp": "2025-11-26 12:24:30",
 *   "error_code": "SERVER_ERROR"
 * }
 *
 * @example
 * // cURL Example
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.api.sponsor_api.v1.game_season.get_game_season_list' \
 * --header 'Authorization: token b1a205e21ae870b:6ee3a5cbfad7b76'
 */

export interface GameSeason {
    name: string;
}

export interface GameSeasonsData {
    status: string;
    categories: GameSeason[];
}

export interface GameSeasonsResponse {
    status: string;
    data: GameSeasonsData;
    message: string;
    timestamp: string;
}

export const getGameSeasonList = (): Promise<GameSeasonsResponse> => {
    const { folder, file, function: methodName } = apiRegistry.getGameSeason;
    const url = buildFrappeMethodURL(folder, file, methodName);

    return api.get<GameSeasonsResponse>(url);
};
