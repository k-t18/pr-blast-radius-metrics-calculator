import { useMemo } from 'react';
import { getSavedFilterData } from '../../services/sponsor_api/getSavedFilterData';
import { useApiQuery } from '../useApiQuery';
import type { ApiResponse } from '../../services/api/apiClient';
import type { TargetAudienceFilterDataItem } from '../../services/sponsor_api/getTargetAudienceFilterData.api';
import { transformToFilterSections } from '../../pages/sponsorshipType/mobileSponsorship/[categories]/createCampaign/utils/targetAudienceFilterDataTransformsToRenderInUi';
import type { FilterSection } from '../../interfaces/mobileSponsorship/filters';

/**
 * Custom hook to fetch saved filter data
 * Uses TanStack Query for caching and automatic refetching
 *
 * @param enabled - Whether the query should be enabled (default: false)
 * @returns Object containing saved filter data, loading state, and error
 */
export const useSavedFilterData = (enabled: boolean = false) => {
    const {
        data: apiData,
        isLoading,
        error,
    } = useApiQuery({
        queryKey: ['saved-filter-data'],
        queryFn: getSavedFilterData,
        enabled,
    });

    // Transform API data to FilterSection format (same transformation as useTargetAudience)
    const savedFilterData: FilterSection[] = useMemo(() => {
        if (!apiData) {
            return [];
        }

        // Handle both wrapped and unwrapped response formats
        let items: TargetAudienceFilterDataItem[] = [];

        if (Array.isArray(apiData)) {
            items = apiData;
        } else if (apiData && typeof apiData === 'object' && 'data' in apiData) {
            const response = apiData as ApiResponse<TargetAudienceFilterDataItem[]>;
            items = Array.isArray(response.data) ? response.data : [];
        } else {
            /* eslint-disable no-console */
            console.error('Unexpected API response format:', typeof apiData, apiData);
            return [];
        }

        if (!Array.isArray(items)) {
            /* eslint-disable no-console */
            console.error('Expected array but got:', typeof items, items);
            return [];
        }

        return transformToFilterSections(items);
    }, [apiData]);

    // Extract direct selections (items without title/subtitle) - these are direct checkbox selections
    const directSelections = useMemo(() => {
        if (!apiData) {
            return [];
        }

        let items: TargetAudienceFilterDataItem[] = [];

        if (Array.isArray(apiData)) {
            items = apiData;
        } else if (apiData && typeof apiData === 'object' && 'data' in apiData) {
            const response = apiData as ApiResponse<TargetAudienceFilterDataItem[]>;
            items = Array.isArray(response.data) ? response.data : [];
        } else {
            return [];
        }

        // Return items that don't have title/subtitle (direct selections like "12-18")
        return items.filter(item => !item.title && !item.sub_title);
    }, [apiData]);

    return {
        savedFilterData,
        directSelections,
        isLoading,
        error,
    };
};

export default useSavedFilterData;
