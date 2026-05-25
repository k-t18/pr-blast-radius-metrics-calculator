import { useApiQuery } from '../useApiQuery';
import { getCampaignFilters, type CampaignFilterKey, type GetCampaignFiltersResponse } from '../../services/adsCampaign/getCampaignFilters.api';

/**
 * Hook to fetch ads-campaign filter options.
 * Fetches once per filter key when enabled and relies on client-side filtering in `CustomTableFilter`.
 */
export function useCampaignFilterOptions(filter: CampaignFilterKey, enabled: boolean = true) {
    const { data, isLoading, error } = useApiQuery<GetCampaignFiltersResponse>({
        queryKey: ['campaign-filter-options', filter],
        queryFn: () => getCampaignFilters({ filter }),
        enabled,
    });

    return {
        filterOptions: data?.data ?? [],
        isLoading,
        error,
    };
}
