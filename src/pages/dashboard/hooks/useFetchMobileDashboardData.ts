import { useApiQuery } from '../../../hooks/useApiQuery';
import { type SponsorshipType } from '../dataset/dashboardDataSets';
import {
    getAgeGroupDistribution,
    type AgeGroupDistributionPoint,
    type AgeGroupDistributionResponse,
} from '../../../services/mobileDashboard/getAgeGroupDistribution.api';
import {
    getAudienceReachAndExposure,
    type AudienceReachAndExposureMetric,
    type AudienceReachAndExposureResponse,
} from '../../../services/mobileDashboard/getAudienceReachAndExposure.api';
import {
    getGenderDistribution,
    type GenderDistributionPoint,
    type GenderDistributionResponse,
} from '../../../services/mobileDashboard/getGenderDistribution.api';
import { getGrowthInUsers, type GrowthInUsersPoint, type GrowthInUsersResponse } from '../../../services/mobileDashboard/getGrowthInUsers.api';
import {
    getEducationDistribution,
    type EducationDistributionPoint,
    type EducationDistributionResponse,
} from '../../../services/mobileDashboard/getEducationDistribution.api';
import {
    getTopCitiesByPlayerCount,
    type TopCitiesResponse,
    type TopCityPoint,
} from '../../../services/mobileDashboard/getTopCitiesByPlayerCount.api';
import {
    getInterestsOfPlayers,
    type InterestPoint,
    type InterestsOfPlayersResponse,
} from '../../../services/mobileDashboard/getInterestsOfPlayers.api';
import {
    getTopPaymentMethods,
    type TopPaymentMethodPoint,
    type TopPaymentMethodsResponse,
} from '../../../services/mobileDashboard/getTopPaymentMethods.api';
import {
    getStateByPlayerCount,
    type StateByPlayerCountPoint,
    type StateByPlayerCountResponse,
} from '../../../services/mobileDashboard/getStateByPlayerCount.api';
import type { ApiResponse } from '../../../services/api/apiClient';

interface UseFetchMobileDashboardDataProperties {
    dateFormat?: number;
    enabled?: boolean;
    sponsorshipType?: SponsorshipType;
}

const useFetchMobileDashboardData = ({ dateFormat, enabled = true, sponsorshipType }: UseFetchMobileDashboardDataProperties = {}) => {
    // Only enable queries when dateFormat is defined and enabled is true
    const shouldEnable = enabled && dateFormat !== undefined;

    const {
        data: growthInUsersApiResponse,
        isLoading: isLoadingGrowthInUsers,
        error: errorGrowthInUsers,
    } = useApiQuery<ApiResponse<GrowthInUsersResponse>>({
        queryKey: ['mobile-dashboard-growth', sponsorshipType, dateFormat],
        queryFn: () => getGrowthInUsers(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    const {
        data: genderDistributionApiResponse,
        isLoading: isLoadingGenderDistribution,
        error: errorGenderDistribution,
    } = useApiQuery<ApiResponse<GenderDistributionResponse>>({
        queryKey: ['mobile-dashboard-gender', sponsorshipType, dateFormat],
        queryFn: () => getGenderDistribution(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    const {
        data: ageGroupDistributionApiResponse,
        isLoading: isLoadingAgeGroupDistribution,
        error: errorAgeGroupDistribution,
    } = useApiQuery<ApiResponse<AgeGroupDistributionResponse>>({
        queryKey: ['mobile-dashboard-age-group', sponsorshipType, dateFormat],
        queryFn: () => getAgeGroupDistribution(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    const {
        data: educationDistributionApiResponse,
        isLoading: isLoadingEducationDistribution,
        error: errorEducationDistribution,
    } = useApiQuery<ApiResponse<EducationDistributionResponse>>({
        queryKey: ['mobile-dashboard-education', sponsorshipType, dateFormat],
        queryFn: () => getEducationDistribution(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    const {
        data: topCitiesApiResponse,
        isLoading: isLoadingTopCities,
        error: errorTopCities,
    } = useApiQuery<ApiResponse<TopCitiesResponse>>({
        queryKey: ['mobile-dashboard-top-cities', sponsorshipType, dateFormat],
        queryFn: () => getTopCitiesByPlayerCount(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    const {
        data: interestsApiResponse,
        isLoading: isLoadingInterests,
        error: errorInterests,
    } = useApiQuery<ApiResponse<InterestsOfPlayersResponse>>({
        queryKey: ['mobile-dashboard-interests', sponsorshipType, dateFormat],
        queryFn: () => getInterestsOfPlayers(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    const {
        data: topPaymentMethodsApiResponse,
        isLoading: isLoadingTopPaymentMethods,
        error: errorTopPaymentMethods,
    } = useApiQuery<ApiResponse<TopPaymentMethodsResponse>>({
        queryKey: ['mobile-dashboard-top-payment-methods', sponsorshipType, dateFormat],
        queryFn: () => getTopPaymentMethods(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    const {
        data: audienceReachApiResponse,
        isLoading: isLoadingAudienceReach,
        error: errorAudienceReach,
    } = useApiQuery<ApiResponse<AudienceReachAndExposureResponse>>({
        queryKey: ['mobile-dashboard-audience-reach', dateFormat],
        queryFn: () => getAudienceReachAndExposure(dateFormat),
        enabled: shouldEnable,
    });

    const {
        data: stateByPlayerCountApiResponse,
        isLoading: isLoadingStateByPlayerCount,
        error: errorStateByPlayerCount,
    } = useApiQuery<ApiResponse<StateByPlayerCountResponse>>({
        queryKey: ['mobile-dashboard-state-by-player-count', sponsorshipType, dateFormat],
        queryFn: () => getStateByPlayerCount(dateFormat, sponsorshipType),
        enabled: shouldEnable,
    });

    return {
        growthInUsersData: (growthInUsersApiResponse?.data?.data?.growthInUsersData ?? []) as GrowthInUsersPoint[],
        growthYAxisDomain: growthInUsersApiResponse?.data?.data?.yAxisDomain,
        genderDistributionData: (genderDistributionApiResponse?.data?.data?.genderDistributionData ?? []) as GenderDistributionPoint[],
        ageGroupsData: (ageGroupDistributionApiResponse?.data?.data?.distributionData ?? []) as AgeGroupDistributionPoint[],
        ageGroupYAxisDomain: ageGroupDistributionApiResponse?.data?.data?.yAxisDomain,
        educationData: (educationDistributionApiResponse?.data?.data?.distributionData ?? []) as EducationDistributionPoint[],
        educationYAxisDomain: educationDistributionApiResponse?.data?.data?.yAxisDomain,
        topCitiesData: (topCitiesApiResponse?.data?.data?.topCitiesByPlayerCountData ?? []) as TopCityPoint[],
        topCitiesYAxisDomain: topCitiesApiResponse?.data?.data?.yAxisDomain,
        interestsOfPlayersData: (interestsApiResponse?.data?.data?.interestsOfPlayersData ?? []) as InterestPoint[],
        topPaymentMethodsData: (topPaymentMethodsApiResponse?.data?.data?.topPaymentMethodsData ?? []) as TopPaymentMethodPoint[],
        topPaymentMethodsYAxisDomain: topPaymentMethodsApiResponse?.data?.data?.yAxisDomain,
        audienceReachMetricsData: (audienceReachApiResponse?.data?.audience_reach_and_exposure ?? []) as AudienceReachAndExposureMetric[],
        stateByPlayerCountData: (stateByPlayerCountApiResponse?.data?.data?.topStateByPlayerCountData ?? []) as StateByPlayerCountPoint[],
        isLoadingAudienceReach,
        isLoadingGrowthInUsers,
        isLoadingGenderDistribution,
        isLoadingAgeGroupDistribution,
        isLoadingEducationDistribution,
        isLoadingTopCities,
        isLoadingInterests,
        isLoadingTopPaymentMethods,
        isLoadingStateByPlayerCount,
        errorAudienceReach,
        errorGrowthInUsers,
        errorGenderDistribution,
        errorAgeGroupDistribution,
        errorEducationDistribution,
        errorTopCities,
        errorInterests,
        errorTopPaymentMethods,
        errorStateByPlayerCount,
    };
};

export default useFetchMobileDashboardData;
