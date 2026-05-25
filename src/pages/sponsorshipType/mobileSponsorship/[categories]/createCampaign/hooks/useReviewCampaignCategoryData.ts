import { useMemo } from 'react';
import { useTargetAudienceFilterData } from '../../../../../../hooks/mobileSponsorship/useTargetAudienceFilterData';
import { buildFilterGroups } from '../utils/buildFilterGroups';
import type { CategoryData } from '../context/createCampaignContext';

/**
 * Custom hook to extract and compute review campaign category data
 * Handles filter groups, campaign type detection, totals calculation, and formatting
 *
 * @param categoryData - The category data object containing filters, squares, leaderboard, and metrics
 * @returns Object containing all computed values for rendering the review component
 */
export function useReviewCampaignCategoryData(categoryData: CategoryData) {
    const { targetAudienceFilterData } = useTargetAudienceFilterData();

    // Get derived metrics from context
    const { audienceReach, baseCPMRate, baseCPCRate, newCPMRate, newCPCRate, targetImpressions, targetClicks } = categoryData.derivedMetrics;

    // Helper functions to format rates
    const formatCPMRate = useMemo(() => {
        if (typeof newCPMRate === 'number') return `₦ ${newCPMRate}`;
        if (typeof baseCPMRate === 'number') return `₦ ${baseCPMRate}`;
        return '-';
    }, [newCPMRate, baseCPMRate]);

    const formatCPCRate = useMemo(() => {
        if (typeof newCPCRate === 'number') return `₦ ${newCPCRate}`;
        if (typeof baseCPCRate === 'number') return `₦ ${baseCPCRate}`;
        return '-';
    }, [newCPCRate, baseCPCRate]);

    // Build Filter Groups
    const filterGroups = useMemo(
        () => buildFilterGroups(categoryData.selectedFilters, categoryData.fieldValues, targetAudienceFilterData),
        [categoryData.selectedFilters, categoryData.fieldValues, targetAudienceFilterData]
    );

    const selectedFiltersCount = filterGroups.reduce((accumulator, group) => accumulator + group.options.length, 0);

    // Determine Campaign Type
    const isSquares = categoryData.selectedSquares.length > 0;

    // Flatten leaderboard rankings from saved weeks
    const leaderboardRankings = useMemo(() => {
        if (!categoryData.weeklyLeaderboardData?.weeks) return [];
        return categoryData.weeklyLeaderboardData.weeks
            .filter(w => w.isSaved)
            .flatMap(week =>
                week.rankings
                    .filter(r => r.isSelected)
                    .map(ranking => ({
                        ...ranking,
                        weekStartDate: week.startDate,
                        weekEndDate: week.endDate,
                        weekId: week.id,
                    }))
            );
    }, [categoryData.weeklyLeaderboardData]);

    const isLeaderboard = leaderboardRankings.length > 0;

    // Calculate Totals for Squares/Leaderboard
    const squaresSubTotal = useMemo(() => {
        return categoryData.selectedSquares.reduce((sum, square) => sum + square.unitSalesPrice, 0);
    }, [categoryData.selectedSquares]);

    const squaresRewardTotal = useMemo(() => {
        return categoryData.selectedSquares.reduce((sum, square) => sum + square.rewardValue, 0);
    }, [categoryData.selectedSquares]);

    const leaderboardSubTotal = useMemo(() => {
        return leaderboardRankings.reduce((sum, rank) => sum + rank.unitSalesPrice, 0);
    }, [leaderboardRankings]);

    const leaderboardRewardTotal = useMemo(() => {
        return leaderboardRankings.reduce((sum, rank) => sum + rank.rewardValue, 0);
    }, [leaderboardRankings]);

    // Format Date
    const formattedStartDate = categoryData.startDate ? new Date(categoryData.startDate).toLocaleDateString('en-GB').replaceAll('/', '-') : '-';

    const durationLabel = isLeaderboard
        ? `${categoryData.weeklyLeaderboardData?.weeks.filter(w => w.isSaved).length || 0}`
        : `${categoryData.duration || 0}`;

    return {
        // Derived metrics
        audienceReach,
        targetImpressions,
        targetClicks,
        // Formatted rates
        formatCPMRate,
        formatCPCRate,
        // Filter groups
        filterGroups,
        selectedFiltersCount,
        // Campaign type flags
        isSquares,
        isLeaderboard,
        // Leaderboard rankings
        leaderboardRankings,
        // Totals
        squaresSubTotal,
        squaresRewardTotal,
        leaderboardSubTotal,
        leaderboardRewardTotal,
        // Formatted values
        formattedStartDate,
        durationLabel,
    };
}

export default useReviewCampaignCategoryData;
