import { useApiQuery } from '../useApiQuery';
import { getBaseRate, type GetBaseRateParameters, type BaseRateResponse } from '../../services/sponsor_api/getBaseRate.api';
import type { ApiResponse } from '../../services/api/apiClient';

export const useBaseRateData = (parameters: GetBaseRateParameters | undefined, enabled: boolean = true) => {
    const { data, isLoading, error } = useApiQuery<ApiResponse<BaseRateResponse>>({
        queryKey: ['base-rate', parameters],
        queryFn: () => {
            if (!parameters) {
                throw new Error('Base rate parameters are required');
            }
            return getBaseRate(parameters);
        },
        enabled: enabled && parameters !== undefined,
    });

    return {
        baseRateData: data?.data,
        isLoading,
        error,
    };
};

export default useBaseRateData;
