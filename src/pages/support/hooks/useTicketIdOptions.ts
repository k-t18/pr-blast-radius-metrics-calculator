import { useApiQuery } from '../../../hooks/useApiQuery';
import type { ApiResponse } from '../../../services/api/apiClient';
import { getIssueList, type IssueListItem } from '../../../services/support/getIssueList.api';

/**
 * Support: Ticket ID filter options.
 * Fetches the list of Ticket document names for autocomplete suggestions.
 */
export function useTicketIdOptions(enabled: boolean = true) {
    const { data, isLoading, error } = useApiQuery<ApiResponse<IssueListItem[]>>({
        queryKey: ['support', 'ticket-id-options'],
        queryFn: () => getIssueList('Issue'),
        enabled,
    });

    return {
        ticketIdOptions: data?.data ?? [],
        isLoading,
        error,
    };
}
