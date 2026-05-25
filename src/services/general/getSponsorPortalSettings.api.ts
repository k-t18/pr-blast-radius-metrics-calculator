import type { SponsorPortalSettings } from '../../interfaces/common/sponsorPortalSettings.types';
import { api, type ApiResponse } from '../api/apiClient';
import { apiRegistry, buildFrappeMethodURL } from '../api/apiRegistry';

/**
 * @function get_sponsor_portal_settings
 * @description
 * Retrieves all configuration values required for Sponsor Portal operations.
 * This includes studio & mobile window-day configurations, billing details,
 * address used for reward transfers, and invoice template preferences.
 * Use this API to load portal defaults/settings on application startup.
 *
 * @route
 * GET {{chances_staging_env}}/api/method/chances_game.api.sponsor_api.v1.sponsor_portal_settings.get_sponsor_portal_settings
 *
 * @authentication
 * Required – provide Authorization token in headers.
 *
 * @header {string}
 * Authorization - Example: `token api_key:api_secret`
 *
 * @requires
 * API Params - None
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure.
 * @returns {SponsorPortalSettings} response.data - Portal config values for sponsor workflow.
 * @returns {string} response.message - Result message from server.
 * @returns {string} response.timestamp - Response time.
 *
 * @typedef {Object} SponsorPortalSettings
 * @property {string} name - Settings document name.
 * @property {string} owner - Creator of record.
 * @property {string|null} creation - Creation timestamp.
 * @property {string} modified - Last modified timestamp.
 * @property {string} modified_by - Last modified by user.
 * @property {number} docstatus
 * @property {number|string} idx
 *
 * @property {number} studio_show_prize_agreement_window_days - Allowed days to submit prize agreement.
 * @property {number} studio_show_creatives_upload_window_days - Window for creative uploads.
 * @property {number} studio_show_cash_reward_transfer_window_days - Transfer TAT (days).
 * @property {Address} studio_show_address_for_gift_reward_transfer - Address doc for reward logistics.
 *
 * @property {number} ticket_reopen_window_days
 *
 * @property {number} mobile_game_prize_agreement_window_days
 * @property {number} mobile_game_creatives_upload_window_days
 * @property {number} mobile_game_cash_reward_transfer_window_days
 * @property {Address} mobile_game_address_for_gift_reward_transfer
 *
 * @property {number} billing_day - Monthly billing day.
 * @property {string} payment_template_for_invoice_generation - Invoice payment rule/template.
 * @property {string} weekly_leaderboard_days - Leaderboard refresh weekday.
 * @property {string} doctype
 *
 * @typedef {Object} Address
 * @property {string} name
 * @property {string} address_title
 * @property {string} address_type
 * @property {string} address_line1
 * @property {string|null} address_line2
 * @property {string|null} custom_region_zone
 * @property {string} city
 * @property {string|null} county
 * @property {string} state
 * @property {string} country
 * @property {string} pincode
 * @property {string|null} email_id
 * @property {string|null} phone
 * @property {boolean|number} is_primary_address
 * @property {boolean|number} is_shipping_address
 * @property {boolean|number} is_your_company_address
 * @property {Array<Link>} links - Linked doctypes (Company etc.)
 *
 * @typedef {Object} Link
 * @property {string} link_doctype
 * @property {string} link_name
 * @property {string} link_title
 *
 * @example
 * // Successful Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "name": "Sponsor Portal Settings",
 *     "studio_show_prize_agreement_window_days": 7,
 *     "mobile_game_creatives_upload_window_days": 30,
 *     "billing_day": 26,
 *     "studio_show_address_for_gift_reward_transfer": { ...address fields },
 *     "mobile_game_address_for_gift_reward_transfer": { ...address fields }
 *   },
 *   "message": "Sponsor portal settings retrieved successfully",
 *   "timestamp": "2025-12-06 13:58:32"
 * }
 *
 * @example
 * // Error Response:
 * {
 *   "status": "error",
 *   "message": "Permission denied or settings not accessible",
 *   "timestamp": "2025-12-06 13:59:44",
 *   "error_code": "PERMISSION_DENIED"
 * }
 *
 * @example
 * // cURL:
 * curl --location '{{chances_staging_env}}/api/method/chances_game.api.sponsor_api.v1.sponsor_portal_settings.get_sponsor_portal_settings' \
 * --header 'Authorization: token api_key:api_secret'
 */

export const getSponsorPortalSettings = async (): Promise<ApiResponse<SponsorPortalSettings>> => {
    const { folder, file, function: methodName } = apiRegistry.getSponsorPortalSettings;
    const url = buildFrappeMethodURL(folder, file, methodName);
    return api.get<ApiResponse<SponsorPortalSettings>>(url);
};
