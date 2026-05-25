import { useApiQuery } from '../useApiQuery';
import type { ApiResponse } from '../../services/api/apiClient';
import { getWinnerCards, type WinnerCard } from '../../services/winners/getWinnerCards.api';
import { getWinnerTable } from '../../services/winners/getWinnerTable.api';
import type { WinnersTabValue } from '../../pages/winnersInfo/dataset/winnersInfoTableColumns';

interface UseWinnerTableOptions {
    limit?: number;
    offset?: number;
    episode?: string;
    reward_type?: string;
    status?: string;
}

export function useWinnerCards() {
    const { data, isLoading, error, refetch } = useApiQuery<ApiResponse<WinnerCard[]>>({
        queryKey: ['winner-cards'],
        queryFn: () => getWinnerCards(),
        gcTime: 0,
        staleTime: 0,
    });

    return {
        data: data?.data ?? [],
        isLoading,
        error: error?.message,
        refetch,
    };
}

/**
 * Hook to fetch winner table data for a given category with pagination.
 */
export function useWinnerTable<RowType>(tab: WinnersTabValue, options?: UseWinnerTableOptions) {
    const limit = options?.limit ?? 10;
    const offset = options?.offset ?? 0;

    const { data, isLoading, error, refetch } = useApiQuery<ApiResponse<RowType[]>>({
        queryKey: ['winner-table', tab, limit, offset, options?.episode, options?.reward_type, options?.status],
        queryFn: () =>
            getWinnerTable<RowType>({
                type: tab,
                limit,
                offset,
                episode: options?.episode,
                reward_type: options?.reward_type,
                status: options?.status,
            }),
        gcTime: 0,
        staleTime: 0,
    });

    return {
        data: data?.data ?? [],
        count: data?.count ?? 0,
        isLoading,
        error: error?.message,
        refetch,
    };
}
