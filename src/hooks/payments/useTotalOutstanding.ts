import { useApiQuery } from '../useApiQuery';
import { getTotalOutstanding, type GetTotalOutstandingResponse } from '../../services/payments/getTotalOutstanding.api';

/**
 * Custom hook to fetch total outstanding amount
 *
 * @returns Object containing total outstanding amount, loading state, and error
 */
export function useTotalOutstanding() {
    const { data, isLoading, error } = useApiQuery<GetTotalOutstandingResponse>({
        queryKey: ['total-outstanding'],
        queryFn: getTotalOutstanding,
    });

    // Extract the total outstanding amount, customer, and email from the API response
    const totalOutstanding = data?.data?.outstanding_amount ?? 0;
    const customer = data?.data?.customer ?? '';
    const email = data?.data?.email ?? '';

    return {
        totalOutstanding,
        customer,
        email,
        isLoading,
        error,
    };
}
