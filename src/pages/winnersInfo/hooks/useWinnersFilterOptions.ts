import { useApiQuery } from '../../../hooks/useApiQuery';
import type { ApiResponse } from '../../../services/api/apiClient';
import { getIssueList, type IssueListItem } from '../../../services/support/getIssueList.api';

export type WinnersFilterKey = 'episode' | 'reward_type' | 'status';

const DOCTYPE_BY_FILTER: Record<WinnersFilterKey, string> = {
    episode: 'Episode',
    reward_type: 'Pledge Type',
    status: 'Status',
};

/**
 * Winners Info: filter options for Episode / Pledge Type / Status.
 * Uses `get_issue_list?doctype_name=<doctype>` and returns `{name}` objects for CustomTableFilter.
 */
export function useWinnersFilterOptions(filter: WinnersFilterKey, enabled: boolean = true) {
    const doctypeName = DOCTYPE_BY_FILTER[filter];

    const { data, isLoading, error } = useApiQuery<ApiResponse<IssueListItem[]>>({
        queryKey: ['winners-info', 'filter-options', filter],
        queryFn: () => getIssueList(doctypeName),
        enabled,
    });

    return {
        filterOptions: data?.data ?? [],
        isLoading,
        error,
    };
}
