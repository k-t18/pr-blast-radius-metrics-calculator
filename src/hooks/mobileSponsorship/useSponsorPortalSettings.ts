import { useApiQuery } from '../useApiQuery';
import { getSponsorPortalSettings } from '../../services/sponsor_api/getSponsorPortalSettings.api';
import type { SponsorPortalSettingsAPIResponse } from '../../services/sponsor_api/getSponsorPortalSettings.api';
import type { ApiResponse } from '../../services/api/apiClient';

export const useSponsorPortalSettings = (enabled: boolean = true) => {
    const { data, isLoading, error } = useApiQuery<ApiResponse<SponsorPortalSettingsAPIResponse>>({
        queryKey: ['sponsor-portal-settings'],
        queryFn: () => getSponsorPortalSettings(),
        enabled,
    });

    return {
        sponsorPortalSettingsData: data,
        isLoading,
        error,
    };
};

export default useSponsorPortalSettings;
