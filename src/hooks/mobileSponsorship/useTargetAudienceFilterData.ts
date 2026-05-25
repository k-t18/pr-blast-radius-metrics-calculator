import { useMemo } from 'react';
import { getTargetAudienceFilterData, type TargetAudienceFilterDataItem } from '../../services/sponsor_api/getTargetAudienceFilterData.api';
import { useApiQuery } from '../useApiQuery';
import type { ApiResponse } from '../../services/api/apiClient';
import type { FilterSection } from '../../interfaces/mobileSponsorship/filters';
import { transformToFilterSections } from '../../pages/sponsorshipType/mobileSponsorship/[categories]/createCampaign/utils/targetAudienceFilterDataTransformsToRenderInUi';

/**
 * Custom hook to fetch and transform target audience filter data
 * Uses TanStack Query for caching and automatic refetching
 *
 * @returns Object containing filter sections, loading state, and error
 */
export const useTargetAudienceFilterData = () => {
    const {
        data: apiData,
        isLoading,
        error,
    } = useApiQuery({
        queryKey: ['target-audience-filter-data'],
        queryFn: getTargetAudienceFilterData,
    });

    // Transform API data to FilterSection format
    const targetAudienceFilterData: FilterSection[] = useMemo(() => {
        if (!apiData) {
            return [];
        }

        // Handle both wrapped and unwrapped response formats
        // The apiClient may return the full ApiResponse object instead of just the data array
        let items: TargetAudienceFilterDataItem[] = [];

        if (Array.isArray(apiData)) {
            // If it's already an array, use it directly
            items = apiData;
        } else if (apiData && typeof apiData === 'object' && 'data' in apiData) {
            // If it's wrapped in ApiResponse, extract the data property
            const response = apiData as ApiResponse<TargetAudienceFilterDataItem[]>;
            items = Array.isArray(response.data) ? response.data : [];
        } else {
            /* eslint-disable no-console */
            console.error('Unexpected API response format:', typeof apiData, apiData);
            return [];
        }

        // Ensure items is an array before processing
        if (!Array.isArray(items)) {
            /* eslint-disable no-console */
            console.error('Expected array but got:', typeof items, items);
            return [];
        }

        return transformToFilterSections(items);
    }, [apiData]);

    console.log('targetAudienceFilterData', targetAudienceFilterData);
    console.log('apiData', apiData);
    console.log('isLoading', isLoading);
    console.log('error', error);

    return {
        targetAudienceFilterData,
        isLoading,
        error,
    };
};

export default useTargetAudienceFilterData;
