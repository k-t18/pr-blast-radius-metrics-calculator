import { create } from 'zustand';
import { getSponsorPortalSettings, type SponsorPortalSettings } from '../services/settings/getSponsorPortalSettings.api';

/**
 * Sponsor Portal Settings Store (Zustand)
 * Stores the three window days values from the API response
 */
interface SponsorPortalSettingsStore {
    studioShowPrizeAgreementWindowDays: number | undefined;
    studioShowCreativesUploadWindowDays: number | undefined;
    studioShowCashRewardTransferWindowDays: number | undefined;
    isLoading: boolean;
    error: Error | undefined;
    fetchSettings: () => Promise<void>;
}

/**
 * Zustand store for sponsor portal settings
 */
export const useSponsorPortalSettingsStore = create<SponsorPortalSettingsStore>(set => ({
    studioShowPrizeAgreementWindowDays: undefined,
    studioShowCreativesUploadWindowDays: undefined,
    studioShowCashRewardTransferWindowDays: undefined,
    isLoading: false,
    error: undefined,
    fetchSettings: async () => {
        set({ isLoading: true, error: undefined });
        try {
            const response = await getSponsorPortalSettings();
            // API returns ApiResponse<SponsorPortalSettings>, so access response.data
            const settings = (response as unknown as { data: SponsorPortalSettings }).data;
            if (settings) {
                set({
                    studioShowPrizeAgreementWindowDays: settings.studio_show_prize_agreement_window_days,
                    studioShowCreativesUploadWindowDays: settings.studio_show_creatives_upload_window_days,
                    studioShowCashRewardTransferWindowDays: settings.studio_show_cash_reward_transfer_window_days,
                    isLoading: false,
                    error: undefined,
                });
            }
            /* eslint-disable no-console */
            console.log('Sponsor portal settings fetched successfully', settings);
        } catch (error) {
            const errorMessage = error instanceof Error ? error : new Error('Failed to fetch sponsor portal settings');
            set({
                isLoading: false,
                error: errorMessage,
            });
            /* eslint-disable no-console */
            console.error('Error fetching sponsor portal settings', error);
        }
    },
}));
