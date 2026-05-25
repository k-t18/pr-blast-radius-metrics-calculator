import { useApiQuery } from '../useApiQuery';
import { getCreditAmount, type GetCreditAmountResponse, type CreditData } from '../../services/payments/getCreditAmount.api';

/**
 * Custom hook to fetch report data query
 *
 * @returns Object containing credit data, loading state, and error
 */
export function useReportDataQuery() {
    const { data, isLoading, error } = useApiQuery<GetCreditAmountResponse>({
        queryKey: ['report-data-query'],
        queryFn: getCreditAmount,
    });

    // Extract the credit data from the API response (first item in array)
    const creditData: CreditData | undefined = data?.data?.[0];

    return {
        creditData,
        isLoading,
        error,
    };
}
