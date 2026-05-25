import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_episode_squares
 * @description
 * Retrieves all square details available for a given episode. Each square includes
 * information such as sequence, square type, title, rate, minimum reward rate,
 * sponsorship status, and other relevant metadata.
 *
 * This endpoint is useful for retrieving the complete square availability for a specific episode.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.square.get_episode_squares
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * The authentication token. Example: `token api_key:api_secret`
 *
 * @query {string} episode_name - Required. Name/ID of the episode.
 *
 * @returns {Object} Response object
 * @returns {string} response.status - Indicates success or failure of the request.
 * @returns {Object} response.data - Contains square details.
 * @returns {Array<Object>} response.data.squares - List of square objects for the episode.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} SquareItem
 * @property {number} sequence - Positioning order of the square.
 * @property {string} square_type - Type of the square (e.g., Gift, Sponsor).
 * @property {string} square_item - Display name/title of the square.
 * @property {number} rate - Sponsorship rate for the square.
 * @property {number} minimum_reward_rate - Minimum allowed reward rate for the square.
 * @property {string} price_list - Pricing list associated with the square.
 * @property {string} row - Studio row for placement of the square.
 * @property {string} sponsorable_status - Indicates whether sponsorship is allowed.
 * @property {string|null} sponsorship_category - Category of sponsorship if assigned.
 * @property {string|null} square_id - Unique ID of the square if available.
 * @property {string|null} square_status - Current status of the square (e.g., Available, Booked).
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "status": "success",
 *     "squares": [
 *       {
 *         "sequence": 5,
 *         "square_type": "Gift",
 *         "square_item": "Studio Gift Square",
 *         "rate": 5000.0,
 *         "minimum_reward_rate": 1000.0,
 *         "price_list": "Studio Show Row 1",
 *         "row": "1",
 *         "sponsorable_status": "Allow",
 *         "sponsorship_category": null,
 *         "square_id": null,
 *         "square_status": null
 *       },
 *       {
 *         "sequence": 1,
 *         "square_type": "Gift",
 *         "square_item": "Studio Gift Square",
 *         "rate": 5000.0,
 *         "minimum_reward_rate": 1000.0,
 *         "price_list": "Studio Show Row 1",
 *         "row": "1",
 *         "sponsorable_status": "Allow",
 *         "sponsorship_category": null,
 *         "square_id": null,
 *         "square_status": null
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-24 16:45:21"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "episode_name is required",
 *   "timestamp": "2025-11-24 16:47:10",
 *   "error_code": "VALIDATION_ERROR"
 * }
 *
 * @example
 * // cURL Example
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.api.sponsor_api.v1.square.get_episode_squares?episode_name=11-Battle%20of%20the%20Brains' \
 * --header 'Authorization: token a5e24fdb78d37f0:09862380195aa43'
 */

export interface EpisodeSquareItem {
    sequence: number;
    square_type: string;
    square_item: string;
    rate: number;
    minimum_reward_rate: number;
    price_list: string;
    row: string;
    sponsorable_status: string;
    sponsorship_category: string | null;
    square_id: string | null;
    square_status: string | null;
    square_lable?: string | number;
}

export interface EpisodeSquaresData {
    status: string;
    squares: EpisodeSquareItem[];
}

export interface EpisodesSquareResponse {
    status: string;
    data: EpisodeSquaresData;
    message: string;
    timestamp: string;
}

export const getStudioShowEpisodeSquares = (episodeName: string): Promise<EpisodesSquareResponse> => {
    const { folder, file, function: methodName } = apiRegistry.studioShowEpisodeSquares;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const endpoint = `${url}?episode_name=${encodeURIComponent(episodeName)}`;

    return api.get<EpisodesSquareResponse>(endpoint);
};
