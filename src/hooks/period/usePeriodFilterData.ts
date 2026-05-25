import { useApiQuery } from '../useApiQuery';
import { getPeriodData } from '../../services/general/getPeriodData.api';
import type { PeriodDataOption } from '../../services/general/getPeriodData.api';

/**
 * Query key for period filter data
 * Used for cache invalidation and query management
 */
export const PERIOD_FILTER_QUERY_KEY = ['ads-period-filter'];

/**
 * Hook to fetch period filter data
 * This hook fetches the period options on mount and caches the result
 */
export const usePeriodFilterData = () => {
    const {
        data: response,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: PERIOD_FILTER_QUERY_KEY,
        queryFn: getPeriodData,
        staleTime: 30 * 60 * 1000, // Consider fresh for 30 minutes
        gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Period filter data fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching period filter data', error_);
        },
    });

    // Extract the data array from the API response
    const periodFilterData: PeriodDataOption[] = response?.data || [];

    return {
        periodFilterData,
        isLoading,
        error,
        refetch,
    };
};
