import { useApiQuery } from '../../../hooks/useApiQuery';
import { type SponsorshipType } from '../dataset/dashboardDataSets';
import {
    getGenderDistribution,
    type GenderDistributionPoint,
    type GenderDistributionResponse,
} from '../../../services/mobileDashboard/getGenderDistribution.api';
import {
    getTopCitiesByPlayerCount,
    type TopCitiesResponse,
    type TopCityPoint,
} from '../../../services/mobileDashboard/getTopCitiesByPlayerCount.api';
import type { ApiResponse } from '../../../services/api/apiClient';

interface UseFetchStudioShowDashboardDataProperties {
    dateFormat?: number;
    enabled?: boolean;
    sponsorshipType?: SponsorshipType;
}

const useFetchStudioShowDashboardData = ({ dateFormat, enabled = true, sponsorshipType }: UseFetchStudioShowDashboardDataProperties = {}) => {
    // Only enable queries when dateFormat is defined and enabled is true
    const shouldEnable = enabled && dateFormat !== undefined;

    const {
        data: genderDistributionApiResponse,
        isLoading: isLoadingGenderDistribution,
        error: errorGenderDistribution,
    } = useApiQuery<ApiResponse<GenderDistributionResponse>>({
        queryKey: ['studio-show-gender', sponsorshipType, dateFormat],
        queryFn: () => getGenderDistribution(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    const {
        data: topCitiesApiResponse,
        isLoading: isLoadingTopCities,
        error: errorTopCities,
    } = useApiQuery<ApiResponse<TopCitiesResponse>>({
        queryKey: ['studio-show-top-cities', sponsorshipType, dateFormat],
        queryFn: () => getTopCitiesByPlayerCount(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    return {
        genderDistributionData: (genderDistributionApiResponse?.data?.data?.genderDistributionData ?? []) as GenderDistributionPoint[],
        topCitiesData: (topCitiesApiResponse?.data?.data?.topCitiesByPlayerCountData ?? []) as TopCityPoint[],
        topCitiesYAxisDomain: topCitiesApiResponse?.data?.data?.yAxisDomain,
        isLoadingGenderDistribution,
        isLoadingTopCities,
        errorGenderDistribution,
        errorTopCities,
    };
};

export default useFetchStudioShowDashboardData;
