import { api } from '../api/apiClient';

/**
 * Sponsor Portal Settings Response
 */
export interface SponsorPortalSettings {
    name: string;
    owner: string;
    creation: string | null;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: string;
    studio_show_prize_agreement_window_days: number;
    studio_show_creatives_upload_window_days: number;
    studio_show_cash_reward_transfer_window_days: number;
    studio_show_address_for_gift_reward_transfer: number;
    ticket_reopen_window_days: number;
    mobile_game_prize_agreement_window_days: number;
    mobile_game_creatives_upload_window_days: number;
    mobile_game_cash_reward_transfer_window_days: number;
    mobile_game_address_for_gift_reward_transfer: number;
    billing_day: number;
    payment_template_for_invoice_generation: string;
    doctype: string;
}

/**
 * @function get_sponsor_portal_settings
 * @description
 * Retrieves sponsor portal settings including window days for prize agreement,
 * creatives upload, and cash reward transfer.
 *
 * @route
 * GET /api/method/chances_game.api.transactions_api.sponsor_portal_settings.get_sponsor_portal_settings
 *
 * @authentication
 * Required — pass Authorization token in headers.
 *
 * @returns {Object} response
 * @returns {string} response.status - Indicates success or failure of the request.
 * @returns {Object} response.data - Sponsor portal settings object.
 * @returns {string} response.message - Message describing the result of the request.
 * @returns {string} response.timestamp - Timestamp when the response was generated.
 */
export const getSponsorPortalSettings = () => {
    return api.get<SponsorPortalSettings>('/api/method/chances_game.api.sponsor_api.v1.sponsor_portal_settings.get_sponsor_portal_settings');
};
