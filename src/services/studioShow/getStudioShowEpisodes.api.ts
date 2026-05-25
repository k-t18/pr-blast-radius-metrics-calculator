import { api } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_studio_show_episodes
 * @description
 * Retrieves a list of approved Studio Show episodes with their basic details
 * such as name, season, episode title, date, time, and number of categories
 * available for sponsorship.
 *
 * This endpoint is useful for fetching the episodes available for sponsorship
 * in the Studio Show format.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.episode.get_studio_show_episodes
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string} Authorization
 * The authentication token. Example: `token api_key:api_secret`
 *
 * @query {number} [season] - Optional. Filters episodes by season.
 * @query {string} [from_date] - Optional. Retrieve episodes from a specific date (YYYY-MM-DD).
 * @query {string} [to_date] - Optional. Retrieve episodes up to a specific date (YYYY-MM-DD).
 *
 * @returns {Object} Response object
 * @returns {string} response.status - Indicates success or failure of the request.
 * @returns {Object} response.data - Contains count and list of episodes.
 * @returns {number} response.data.count - Total number of episodes returned.
 * @returns {Array<Object>} response.data.data - List of episode objects.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 *
 * @typedef {Object} Episode
 * @property {string} name - Unique ID of the episode.
 * @property {string} season - Season number.
 * @property {string} episode_title - Title of the episode.
 * @property {string} episode_date - Air date (YYYY-MM-DD).
 * @property {string} episode_time - Air time (HH:MM:SS).
 * @property {number} categories_available - Number of category items available.
 *
 * @example
 * // Successful request
 * {
 *   "status": "success",
 *   "data": {
 *     "status": "success",
 *     "count": 4,
 *     "data": [
 *       {
 *         "name": "10-Battle of the Brains",
 *         "season": "3",
 *         "episode_title": "Battle of the Brains",
 *         "episode_date": "2025-11-15",
 *         "episode_time": "18:00:00",
 *         "categories_available": 2
 *       },
 *       {
 *         "name": "5-Battle of the Brains",
 *         "season": "3",
 *         "episode_title": "Battle of the Brains",
 *         "episode_date": "2025-11-15",
 *         "episode_time": "18:00:00",
 *         "categories_available": 2
 *       }
 *     ]
 *   },
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-11-24 16:34:42"
 * }
 *
 * @example
 * // Error response
 * {
 *   "status": "error",
 *   "message": "frappe.exceptions.PermissionError: Not allowed to access this resource.",
 *   "timestamp": "2025-11-24 12:04:25",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL Example
 * curl --location 'http://dev-chances.8848digitalerp.com/api/method/chances_game.api.sponsor_api.v1.episode.get_studio_show_episodes?season=3' \
 * --header 'Authorization: token 77c9baed11e27fd:7557e6e5d6f144d'
 */

export interface StudioShowEpisode {
    name: string;
    season: string;
    episode_title: string;
    episode_date: string;
    episode_time: string;
    categories_available: number;
    status: string;
}

export interface StudioShowEpisodesData {
    status: string;
    count: number;
    data: StudioShowEpisode[];
}

export interface StudioShowEpisodesResponse {
    status: string;
    data: StudioShowEpisodesData;
    message: string;
    timestamp: string;
}

export const getStudioShowEpisodes = (season?: string): Promise<StudioShowEpisodesResponse> => {
    const queryParameters = new URLSearchParams();

    if (season !== undefined) {
        queryParameters.append('season', season.toString());
    }

    const queryString = queryParameters.toString();
    const { folder, file, function: methodName } = apiRegistry.getStudioShowEpisodes;
    const url = buildFrappeMethodURL(folder, file, methodName);
    const endpoint = `${url}${queryString ? `?${queryString}` : ''}`;

    return api.get<StudioShowEpisodesResponse>(endpoint);
};
