import { useApiQuery } from '../useApiQuery';
import {
    getTotalAudienceReach,
    type GetTotalAudienceReachParameters,
    type TotalAudienceReachResponse,
} from '../../services/sponsor_api/getTotalAudienceReach.api';
import type { ApiResponse } from '../../services/api/apiClient';

export const useTotalAudienceReach = (parameters: GetTotalAudienceReachParameters | undefined, enabled: boolean = true) => {
    const { data, isLoading, error } = useApiQuery<ApiResponse<TotalAudienceReachResponse>>({
        queryKey: ['total-audience-reach', parameters],
        queryFn: () => getTotalAudienceReach(parameters || {}),
        enabled,
    });

    return {
        totalAudienceReachData: data?.data,
        isLoading,
        error,
    };
};

export default useTotalAudienceReach;
