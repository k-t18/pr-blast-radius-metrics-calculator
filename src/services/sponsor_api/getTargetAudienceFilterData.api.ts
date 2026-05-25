import { api } from '../api/apiClient';

/**
 * @function get_target_audience_tree
 * @description
 * Retrieves the complete target audience tree structure with hierarchical
 * filter options including sections, subsections, and their children.
 * The response includes filter metadata such as titles, subtitles, and input types.
 *
 * @route
 * GET /api/method/chances_game.api.sponsor_api.v1.target_audience.get_target_audience_tree
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @header
 * Authorization - Authentication token. Example: `token api_key:api_secret`
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates whether the request succeeded.
 * @returns {Array<Object>} response.data - Array of target audience tree items.
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
 * // Request (input):
 * // GET /api/method/chances_game.api.sponsor_api.v1.target_audience.get_target_audience_tree
 * // Headers:
 * //   Authorization: token api_key:api_secret
 *
 * @example
 * // Successful Response (output):
 * {
 *   "status": "success",
 *   "data": [
 *     { "name": "12-18", "parent_target_audience": null, "title": null, "sub_title": null, "type": null, "children": [] },
 *     {
 *       "name": "target_audience-0170",
 *       "parent_target_audience": null,
 *       "title": "Where are they located?",
 *       "sub_title": "(Country, state, region etc)",
 *       "type": "",
 *       "children": [
 *         {
 *           "name": "target_audience-0171",
 *           "parent_target_audience": "target_audience-0170",
 *           "title": "Country",
 *           "sub_title": null,
 *           "type": "dropdown",
 *           "children": [
 *             { "name": "target_audience-0172", "parent_target_audience": "target_audience-0171", "title": "Nigeria", "sub_title": null, "type": "", "children": [] },
 *             { "name": "target_audience-0173", "parent_target_audience": "target_audience-0171", "title": "Uganda", "sub_title": null, "type": "", "children": [] }
 *           ]
 *         },
 *         {
 *           "name": "target_audience-0174",
 *           "parent_target_audience": "target_audience-0170",
 *           "title": "Region / Zone",
 *           "sub_title": null,
 *           "type": "checkbox",
 *           "children": [
 *             { "name": "target_audience-0175", "parent_target_audience": "target_audience-0174", "title": "All regions", "sub_title": null, "type": "", "children": [] },
 *             {
 *               "name": "target_audience-0176",
 *               "parent_target_audience": "target_audience-0174",
 *               "title": "North Central",
 *               "sub_title": null,
 *               "type": "checkbox",
 *               "children": [
 *                 { "name": "target_audience-0184", "parent_target_audience": "target_audience-0176", "title": "Ghatkopar", "sub_title": null, "type": "", "children": [] },
 *                 { "name": "target_audience-0185", "parent_target_audience": "target_audience-0176", "title": "Ghatkopar west", "sub_title": null, "type": "", "children": [] }
 *               ]
 *             }
 *           ]
 *         },
 *         {
 *           "name": "target_audience-0181",
 *           "parent_target_audience": "target_audience-0170",
 *           "title": "Cities / Local Areas",
 *           "sub_title": null,
 *           "type": "multiselect",
 *           "children": [
 *             { "name": "target_audience-0182", "parent_target_audience": "target_audience-0181", "title": "Ahuja Metro", "sub_title": null, "type": "", "children": [] },
 *             { "name": "target_audience-0183", "parent_target_audience": "target_audience-0181", "title": "Mumbai", "sub_title": null, "type": "", "children": [] }
 *           ]
 *         }
 *       ]
 *     },
 *     {
 *       "name": "target_audience-0177",
 *       "parent_target_audience": null,
 *       "title": "Who are they? ",
 *       "sub_title": "(Detailed Demographics)",
 *       "type": "",
 *       "children": [
 *         {
 *           "name": "target_audience-0178",
 *           "parent_target_audience": "target_audience-0177",
 *           "title": "Gender",
 *           "sub_title": null,
 *           "type": "checkbox",
 *           "children": [
 *             { "name": "Female", "parent_target_audience": "target_audience-0178", "title": "Female", "sub_title": null, "type": "", "children": [] },
 *             { "name": "Male", "parent_target_audience": "target_audience-0178", "title": "Male", "sub_title": null, "type": "", "children": [] }
 *           ]
 *         }
 *       ]
 *     }
 *   ],
 *   "message": "Target Audience retrieved successfully",
 *   "timestamp": "2025-12-09 08:35:14"
 * }
 *
 * @example
 * // Error Response (output):
 * {
 *   "status": "error",
 *   "message": "An error occurred",
 *   "timestamp": "2025-12-09 08:35:14",
 *   "error_code": "ERROR_CODE"
 * }
 */

export interface TargetAudienceFilterDataItem {
    name: string;
    parent_target_audience: string | null;
    title: string | null;
    sub_title: string | null;
    type: string | null;
    children: TargetAudienceFilterDataItem[];
}

export const getTargetAudienceFilterData = () =>
    api.get<TargetAudienceFilterDataItem[]>('/api/method/chances_game.api.sponsor_api.v1.target_audience.get_target_audience_tree');
