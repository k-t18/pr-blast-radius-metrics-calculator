import { useApiQuery } from '../useApiQuery';
import { getInvoiceCardMetrics, type GetInvoiceCardMetricsResponse } from '../../services/payments/getInvoiceCardMetrics.api';

/**
 * Custom hook to fetch invoice card metrics
 *
 * @returns Object containing invoice card metrics (totalPaid, unpaid, overdue), loading state, and error
 */
export function useInvoiceCardMetrics() {
    const { data, isLoading, error } = useApiQuery<GetInvoiceCardMetricsResponse>({
        queryKey: ['invoice-card-metrics'],
        queryFn: getInvoiceCardMetrics,
    });

    // Parse the API response array and extract values
    const metrics = data?.data ?? [];

    // Find and extract values from the array of objects
    const overdue = metrics.find(item => item.Overdue !== undefined)?.Overdue ?? 0;
    const totalPaid = metrics.find(item => item['Total Paid'] !== undefined)?.['Total Paid'] ?? 0;
    const unpaid = metrics.find(item => item['Unpaid Invoices'] !== undefined)?.['Unpaid Invoices'] ?? 0;

    return {
        totalPaid,
        unpaid,
        overdue,
        isLoading,
        error,
    };
}
