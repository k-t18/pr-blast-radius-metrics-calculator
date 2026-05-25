import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_crosseling_episodes
 * @description
 * Retrieves cross-selling episodes for a given sponsorship category.
 * Returns square items and category items that can be recommended to users.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.episode.get_crosseling_episodes
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * The authentication token. Example: `token api_key:api_secret`
 *
 * @query {string} sponsorship_category - Required. JSON-encoded array of sponsorship categories to get cross-selling items for. Example: ["Studio Branding", "Mobile Weekly Leaderboard Branding"]
 *
 * @returns {Object} Response object
 * @returns {string} response.status - Indicates success or failure of the request.
 * @returns {Object} response.data - Contains cross-selling data.
 * @returns {string} response.data.input_category - The input category used for the query.
 * @returns {Array<string>} response.data.cross_sell_categories - List of cross-sell category names.
 * @returns {Array<SquareItem>} response.data.square_items - List of square items for cross-selling.
 * @returns {Array<CategoryItem>} response.data.category_items - List of category items for cross-selling.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "input_category": "Studio Branding",
 *     "cross_sell_categories": ["Studio Gift Square"],
 *     "square_items": [
 *       {
 *         "episode_name": "21",
 *         "episode_title": "Battle of the Brains",
 *         "square_item": "Studio Gift Square",
 *         "sponsorship_category": "Studio Gift Square"
 *       }
 *     ],
 *     "category_items": [
 *       {
 *         "episode_name": "1-Battle of the Brains",
 *         "episode_title": "Battle of the Brains",
 *         "item": "Studio Gift Square",
 *         "sponsorship_category": "Studio Gift Square",
 *         "category_rate": 5000.0
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-23 10:47:28"
 * }
 */

export interface SquareItem {
    episode_name: string;
    episode_title: string;
    square_item: string;
    sponsorship_category: string;
    square_lable?: string | number;
    square_type?: string;
    square_id?: string;
}

export interface CategoryItem {
    episode_name: string;
    episode_title: string;
    item: string;
    sponsorship_category: string;
    category_rate: number;
    custom_minimum_reward_rate?: number;
}

export interface CrossSellingEpisodesData {
    input_category: string;
    cross_sell_categories: string[];
    square_items: SquareItem[];
    category_items: CategoryItem[];
}

export interface CrossSellingEpisodesResponse {
    status: string;
    data: CrossSellingEpisodesData;
    message: string;
    timestamp: string;
}

export interface GetCrossSellingEpisodesParameters {
    sponsorship_category: string[];
}

export const getCrossSellingEpisodes = ({ sponsorship_category }: GetCrossSellingEpisodesParameters): Promise<CrossSellingEpisodesResponse> => {
    const { folder, file, function: methodName } = apiRegistry.crossSellingEpisodes;
    const url = buildFrappeMethodURL(folder, file, methodName);
    // JSON encode the array and then URL encode it
    const encodedCategories = encodeURIComponent(JSON.stringify(sponsorship_category));
    const endpoint = `${url}?sponsorship_category=${encodedCategories}`;

    return api.get<CrossSellingEpisodesResponse>(endpoint);
};
