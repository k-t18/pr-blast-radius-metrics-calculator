import { useApiQuery } from '../useApiQuery';
import type { ApiResponse } from '../../services/api/apiClient';
import type { AdsCampaign, AdsCampaignMetricCard } from '../../interfaces/adsCampaign/adsCampaign.types';
import { getOverallPerformanceMetrics } from '../../services/adsCampaign/getOverallPerformanceMetrics.api';
import { getRewardCampaignMetrics } from '../../services/adsCampaign/getRewardCampaignMetrics.api';
import { getEstimatedVsActualImpressions, type EstimatedActualResponse } from '../../services/adsCampaign/getEstimatedVsActualImpressions.api';
import { getEstimatedVsActualClicks, type EstimatedActualClicksResponse } from '../../services/adsCampaign/getEstimatedVsActualClicks.api';
import { getCampaigns, type CampaignsResponse } from '../../services/adsCampaign/getCampaigns.api';

interface CampaignsOptions {
    limit?: number;
    offset?: number;
    creatives_id?: string;
    order_id?: string;
    campaign_name?: string;
}

type RawCampaign = AdsCampaign & {
    workflow_state?: string;
    total_budget?: number | string;
};

const mapCampaign = (campaign: RawCampaign): AdsCampaign => ({
    ...campaign,
    // Align backend fields to UI expectations
    status: campaign.workflow_state ?? campaign.status,
    total_amount: campaign.total_amount ?? (campaign.total_budget ? Number(campaign.total_budget) : 0),
});

export function useCampaigns(status: 'Live' | 'Submitted', options: CampaignsOptions = {}) {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    const { data, isLoading, error, refetch } = useApiQuery<ApiResponse<CampaignsResponse>>({
        queryKey: ['ads-campaigns', status, limit, offset, options.creatives_id, options.order_id, options.campaign_name],
        queryFn: () =>
            getCampaigns({
                status,
                limit,
                offset,
                creatives_id: options.creatives_id,
                order_id: options.order_id,
                campaign_name: options.campaign_name,
            }),
        gcTime: 0,
        staleTime: 0,
    });

    const campaigns = (data?.data?.data ?? []).map(item => mapCampaign(item as RawCampaign));

    return {
        data: campaigns,
        count: data?.data?.total ?? campaigns.length,
        isLoading,
        error: error?.message,
        refetch,
    };
}

interface AdsCampaignMetricsOptions {
    dateFormat?: number;
    enabled?: boolean;
}

const useAdsCampaignMetricsData = ({ dateFormat, enabled }: AdsCampaignMetricsOptions = {}) => {
    const {
        data: overallPerformanceData,
        isLoading: isLoadingOverall,
        error: overallError,
    } = useApiQuery<ApiResponse<AdsCampaignMetricCard[]>>({
        queryKey: ['ads-overall-performance-metrics', dateFormat],
        queryFn: () => getOverallPerformanceMetrics(dateFormat),
        gcTime: 0,
        staleTime: 0,
        enabled,
    });

    const {
        data: rewardCampaignData,
        isLoading: isLoadingRewards,
        error: rewardError,
    } = useApiQuery<ApiResponse<AdsCampaignMetricCard[]>>({
        queryKey: ['ads-reward-campaign-metrics', dateFormat],
        queryFn: () => getRewardCampaignMetrics(dateFormat),
        gcTime: 0,
        staleTime: 0,
        enabled,
    });

    const {
        data: impressionsData,
        isLoading: isLoadingImpressions,
        error: impressionsError,
    } = useApiQuery<ApiResponse<EstimatedActualResponse>>({
        queryKey: ['ads-estimated-vs-actual-impressions', dateFormat],
        queryFn: () => getEstimatedVsActualImpressions(dateFormat),
        gcTime: 0,
        staleTime: 0,
        enabled,
    });

    const {
        data: clicksData,
        isLoading: isLoadingClicks,
        error: clicksError,
    } = useApiQuery<ApiResponse<EstimatedActualClicksResponse>>({
        queryKey: ['ads-estimated-vs-actual-clicks', dateFormat],
        queryFn: () => getEstimatedVsActualClicks(dateFormat),
        gcTime: 0,
        staleTime: 0,
        enabled,
    });

    return {
        overallPerformanceCards: overallPerformanceData?.data ?? [],
        isLoadingOverall,
        overallError: overallError?.message,
        rewardCampaignCards: rewardCampaignData?.data ?? [],
        isLoadingRewards,
        rewardError: rewardError?.message,
        impressionsBarData: impressionsData?.data?.impressionsList ?? [],
        impressionsDomain: impressionsData?.data?.yAxisDomain ?? [0, 0],
        isLoadingImpressions,
        impressionsError: impressionsError?.message,
        clicksBarData: clicksData?.data?.clicksList ?? [],
        clicksDomain: clicksData?.data?.yAxisDomain ?? [0, 0],
        isLoadingClicks,
        clicksError: clicksError?.message,
    };
};

export default useAdsCampaignMetricsData;
