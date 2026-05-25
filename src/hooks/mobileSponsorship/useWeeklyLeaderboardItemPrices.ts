import { useApiQuery } from '../useApiQuery';
import { getWeeklyLeaderboardItemPrices } from '../../services/sponsor_api/getWeeklyLeaderboardItemPrices.api';

/**
 * Custom hook to fetch weekly leaderboard item prices (rankings)
 * Uses useApiQuery (TanStack Query) for data fetching
 *
 * @param date - The date to fetch prices for
 * @param enabled - Whether the query should be enabled
 * @returns Object containing prices data, loading state, and error
 */
export const useWeeklyLeaderboardItemPrices = (date: string | undefined, enabled: boolean = true) => {
    const {
        data: weeklyLeaderboardItemPricesData,
        isLoading,
        error,
    } = useApiQuery({
        queryKey: ['weekly-leaderboard-item-prices', date],
        queryFn: () => getWeeklyLeaderboardItemPrices(date!),
        enabled: enabled && !!date,
    });

    return {
        weeklyLeaderboardItemPricesData,
        isLoading,
        error,
    };
};

export default useWeeklyLeaderboardItemPrices;
