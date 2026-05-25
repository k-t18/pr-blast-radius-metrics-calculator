import { useMemo } from 'react';
import { useApiQuery } from '../useApiQuery';
import {
    getMobileGameSponsorshipCategories,
    type GetMobileGameSponsorshipItemsParameters,
    type MobileGameSponsorshipItemsResponse,
} from '../../services/sponsor_api/getMobileGameSponsorshipCategories.api';
import { transformApiItemToCategoryItem } from '../../pages/sponsorshipType/mobileSponsorship/[categories]/createCampaign/utils/mobileSponsorshipCategoryUtils';
import { useMobileSponsorshipCategoriesStore } from '../../stores/mobileSponsorshipCategoriesStore';

/**
 * Map route category to API sponsorship type
 */
export const mapCategoryToSponsorshipType = (category: string): 'run_campaigns' | 'sponsor_rewards' | 'both' => {
    if (category === 'sponsor-rewards') {
        return 'sponsor_rewards';
    }
    if (category === 'run-ad-campaigns') {
        return 'run_campaigns';
    }
    if (category === 'both-rewards-ads') {
        return 'both';
    }
    // Default to 'both'
    return 'both';
};

/**
 * Custom hook to fetch mobile game sponsorship items
 * Uses TanStack Query for caching and automatic refetching
 *
 * @param parameters - Parameters for fetching sponsorship items, or a category string that will be mapped
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Object containing categories data (transformed), sponsorship items data, loading state, and error
 */
export const useMobileGameSponsorshipCategory = (
    parameters: GetMobileGameSponsorshipItemsParameters | string | undefined,
    enabled: boolean = true
) => {
    // Convert category string to parameters object if needed
    const apiParameters: GetMobileGameSponsorshipItemsParameters | undefined =
        typeof parameters === 'string' ? { sponsorship_type: mapCategoryToSponsorshipType(parameters) } : parameters;

    const {
        data: apiData,
        isLoading,
        error,
    } = useApiQuery({
        queryKey: ['mobile-game-sponsorship-items', apiParameters],
        queryFn: () => {
            if (!apiParameters) {
                throw new Error('Mobile game sponsorship items parameters are required');
            }
            return getMobileGameSponsorshipCategories(apiParameters);
        },
        enabled: enabled && apiParameters !== undefined,
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Mobile game sponsorship items fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching mobile game sponsorship items', error_);
        },
    });

    // Handle API response format
    // The apiClient returns ApiResponse<T>, so we need to extract the data property
    let sponsorshipItemsData: MobileGameSponsorshipItemsResponse | undefined;

    if (apiData) {
        if (typeof apiData === 'object' && 'data' in apiData) {
            // Response is wrapped in ApiResponse format: { status, data, message, timestamp }
            const response = apiData as unknown as { data: MobileGameSponsorshipItemsResponse; status: string };
            sponsorshipItemsData = response.data;
        } else {
            // Response is already unwrapped (shouldn't happen with current apiClient, but handle it)
            sponsorshipItemsData = apiData as MobileGameSponsorshipItemsResponse;
        }
    }

    // Transform API data to CategoryItem array
    const categoriesData = useMemo(() => {
        if (!sponsorshipItemsData?.items) {
            return [];
        }
        return sponsorshipItemsData.items.map(item => transformApiItemToCategoryItem(item));
    }, [sponsorshipItemsData]);

    // Store raw API data in Zustand store when fetched
    const { setSponsorshipItemsData, setLoading } = useMobileSponsorshipCategoriesStore();
    const categoryParameter = typeof parameters === 'string' ? parameters : undefined;

    // Store data in Zustand when ready
    useMemo(() => {
        setLoading(isLoading);
        if (!isLoading && sponsorshipItemsData && categoryParameter) {
            setSponsorshipItemsData(sponsorshipItemsData, categoryParameter);
        }
    }, [sponsorshipItemsData, isLoading, categoryParameter, setSponsorshipItemsData, setLoading]);

    return {
        categoriesData,
        sponsorshipItemsData,
        isLoading,
        error,
    };
};

export default useMobileGameSponsorshipCategory;
