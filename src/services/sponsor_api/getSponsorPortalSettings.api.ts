import { api, type ApiResponse } from '../api/apiClient';

export interface SponsorPortalSettingsResponse {
    name: string;
    owner: string;
    creation: string | null;
    modified: string;
    modified_by: string;
    docstatus: number;
    idx: number;
    studio_show_prize_agreement_window_days: number;
    studio_show_creatives_upload_window_days: number;
    studio_show_cash_reward_transfer_window_days: number;
    ticket_reopen_window_days: number;
    mobile_game_prize_agreement_window_days: number;
    mobile_game_creatives_upload_window_days: number;
    mobile_game_cash_reward_transfer_window_days: number;
    billing_day: number;
    payment_template_for_invoice_generation: string;
    weekly_leaderboard_days: string;
    weekly_leaderboard_duration?: number;
    doctype: string;
}

export type SponsorPortalSettingsAPIResponse = SponsorPortalSettingsResponse;

/**
 * Fetches the sponsor portal settings, including the configured start day for weekly leaderboards.
 *
 * @returns Promise with valid settings response
 */
export const getSponsorPortalSettings = () => {
    return api.get<ApiResponse<SponsorPortalSettingsAPIResponse>>(
        '/api/method/chances_game.api.sponsor_api.v1.sponsor_portal_settings.get_sponsor_portal_settings'
    );
};
