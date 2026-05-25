import { api } from '../api/apiClient';
import type { TargetAudienceFilterDataItem } from './getTargetAudienceFilterData.api';

/**
 * @function get_user_target_audience
 * @description
 * Retrieves the user's saved target audience filters.
 * Returns the same structure as get_target_audience_tree but with user's saved selections.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.target_audience.get_user_target_audience
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Array<Object>} response.data - Array of target audience tree items with user's saved selections.
 * @returns {string} response.data[].name - Unique identifier for the target audience item.
 * @returns {string|null} response.data[].parent_target_audience - Parent item identifier (null for root items).
 * @returns {string|null} response.data[].title - Title of the section or option.
 * @returns {string|null} response.data[].sub_title - Subtitle or description.
 * @returns {string|null} response.data[].type - Input type (e.g., "Drop Down", "Check Box", "Multi Select", "Radio Bouton", or empty string).
 * @returns {Array<Object>} response.data[].children - Array of child items (recursive structure).
 * @returns {string} response.message - Message describing the result.
 * @returns {string} response.timestamp - Time at which the response was generated.
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": [
 *     {
 *       "name": "12-18",
 *       "parent_target_audience": null,
 *       "title": null,
 *       "sub_title": null,
 *       "type": null,
 *       "children": []
 *     },
 *     {
 *       "name": "target_audience-0170",
 *       "parent_target_audience": null,
 *       "title": "Where are they located?",
 *       "sub_title": "(Country, state, region etc)",
 *       "type": "",
 *       "children": [
 *         {
 *           "name": "target_audience-0174",
 *           "parent_target_audience": "target_audience-0170",
 *           "title": "Region / Zone",
 *           "sub_title": null,
 *           "type": "checkbox",
 *           "children": []
 *         }
 *       ]
 *     }
 *   ],
 *   "message": "Request processed successfully",
 *   "timestamp": "2025-12-03 09:58:39"
 * }
 */

export const getSavedFilterData = () =>
    api.get<TargetAudienceFilterDataItem[]>('/api/method/chances_game.api.sponsor_api.v1.target_audience.get_user_target_audience');
