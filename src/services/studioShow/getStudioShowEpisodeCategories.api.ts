import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_episode_categories
 * @description
 * Retrieves a combined list of sponsorship categories and the first square
 * available for a given episode. Each item includes relevant details such as
 * title, rate, status, and type (to differentiate whether it's a category or square).
 *
 * This endpoint is useful for fetching sponsorship options for a specific episode.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.category.get_episode_categories
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
 * @returns {Object} response.data - Contains the list of category/square details.
 * @returns {Array<Object>} response.data.categories - Combined list of category and square objects.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} CategoryItem
 * @property {string} title - Display name of the category/square.
 * @property {number} rate - Rate defined for the sponsorship option.
 * @property {string|null} status - Status of the item (e.g., Available, Booked).
 * @property {string} type - Indicates whether the item is 'category' or 'square'.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "status": "success",
 *     "categories": [
 *       {
 *         "title": "Studio Branding",
 *         "rate": 70000.0,
 *         "status": null,
 *         "type": "category"
 *       },
 *       {
 *         "title": "Studio Title",
 *         "rate": 10000.0,
 *         "status": null,
 *         "type": "category"
 *       },
 *       {
 *         "title": "Studio Gift Square",
 *         "rate": 5000.0,
 *         "status": null,
 *         "type": "square"
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-24 16:46:32"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "episode_name is required",
 *   "timestamp": "2025-11-24 16:48:12",
 *   "error_code": "VALIDATION_ERROR"
 * }
 *
 * @example
 * // cURL Example
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.api.sponsor_api.v1.category.get_episode_categories?episode_name=11-Battle%20of%20the%20Brains' \
 * --header 'Authorization: token a5e24fdb78d37f0:09862380195aa43'
 */

export interface EpisodeCategoryItem {
    name: string;
    title: string;
    rate: number;
    status: string | null;
    type: string;
    sponsorship_category: string;
    category_rate: number;
    item: string;
    square_status: string;
    custom_minimum_reward_rate: number;
    minimum_reward_rate: number;
    description: string;
    row?: string | number;
}

export interface EpisodeCategoryData {
    status: string;
    categories: EpisodeCategoryItem[];
}

export interface EpisodeCategoryResponse {
    status: string;
    data: EpisodeCategoryData;
    message: string;
    timestamp: string;
}

export const getStudioShowEpisodeCategories = (episodeName: string): Promise<EpisodeCategoryResponse> => {
    const { folder, file, function: methodName } = apiRegistry.studioShowEpisodeCategories;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const endpoint = `${url}?episode_name=${encodeURIComponent(episodeName)}`;

    return api.get<EpisodeCategoryResponse>(endpoint);
};
