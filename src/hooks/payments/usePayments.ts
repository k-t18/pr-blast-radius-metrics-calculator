import { useApiQuery } from '../useApiQuery';
import { getPaidAndUnpaidPayments, type GetPaidAndUnpaidPaymentsResponse } from '../../services/payments/getPaidAndUnpaidPayments.api';

export interface UsePaymentsParameters {
    type: 'paid' | 'unpaid';
    limit?: number;
    offset?: number;
    invoice_id?: string;
}

/**
 * Custom hook to fetch paid or unpaid payments with pagination
 *
 * @param parameters - Parameters for fetching payments
 * @returns Object containing payments data, loading state, error, and total count
 */
export function usePayments(parameters: UsePaymentsParameters) {
    const { data, isLoading, error } = useApiQuery<GetPaidAndUnpaidPaymentsResponse>({
        queryKey: ['payments', parameters.type, parameters.limit, parameters.offset, parameters.invoice_id],
        queryFn: () => {
            const apiParameters = { ...parameters };
            return getPaidAndUnpaidPayments(apiParameters);
        },
        gcTime: 60000, // Cache time: 1 minute (60000ms)
        staleTime: 60000, // Stale time: 1 minute (60000ms)
    });

    // Extract the payments array and total count from the API response
    const payments = data?.data ?? [];
    const totalCount = data?.count ?? 0;

    return {
        payments,
        isLoading,
        error,
        totalCount,
    };
}
