import { useApiQuery } from '../useApiQuery';
import { getSponsorPortalSettings } from '../../services/settings/getSponsorPortalSettings.api';

/**
 * Hook to fetch sponsor portal settings
 * This hook fetches the settings on mount and caches the result
 */
export const useSponsorPortalSettings = () => {
    const {
        data: settings,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: ['sponsor-portal-settings'],
        queryFn: getSponsorPortalSettings,
        staleTime: 30 * 60 * 1000, // Cache for 30 minutes (settings don't change often)
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Sponsor portal settings fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching sponsor portal settings', error_);
        },
    });

    return {
        settings,
        isLoading,
        error,
        refetch,
        // Extract the three window days values
        studioShowPrizeAgreementWindowDays: settings?.studio_show_prize_agreement_window_days,
        studioShowCreativesUploadWindowDays: settings?.studio_show_creatives_upload_window_days,
        studioShowCashRewardTransferWindowDays: settings?.studio_show_cash_reward_transfer_window_days,
    };
};
