import type { LeaderboardRanking, LeaderboardWeek } from '../context/createCampaignContext';
import type { WeeklyLeaderboardItemPrice } from '../../../../../../services/sponsor_api/getWeeklyLeaderboardItemPrices.api';

// Generates a unique ID
export const generateId = () => Math.random().toString(36).slice(2, 9);

// Parses a comma-separated number string to an integer
export const parseNumber = (value?: string): number => {
    if (!value) return 0;
    return Number.parseInt(value.toString().replaceAll(',', ''), 10) || 0;
};

// Calculates end date by adding 6 days to the start date
export const calculateEndDate = (startDate: string): string => {
    if (!startDate) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + 6);
    return date.toISOString().split('T')[0];
};

// Calculates totals (unit sales, reward value, and grand total) for a specific week
export const getWeekTotals = (week: LeaderboardWeek) => {
    const selected = week.rankings.filter(r => r.isSelected);
    const subtotalUnitSales = selected.reduce((sum, r) => sum + r.unitSalesPrice, 0);
    const subtotalRewardValue = selected.reduce((sum, r) => sum + r.rewardValue, 0);
    return {
        subtotalUnitSales,
        subtotalRewardValue,
        total: subtotalUnitSales + subtotalRewardValue,
    };
};

// Validates that a week has a start date, selected rankings, and valid reward values
export const isWeekValid = (week: LeaderboardWeek) => {
    const hasDate = !!week.startDate;
    const hasSelected = week.rankings.some(r => r.isSelected);
    const rewardsValid = week.rankings.filter(r => r.isSelected).every(r => r.rewardValue >= r.minReward);
    return hasDate && hasSelected && rewardsValid;
};

// Transforms API response data into LeaderboardRanking array
export const transformItemPricesToRankings = (itemPrices: WeeklyLeaderboardItemPrice[], weekId: string): LeaderboardRanking[] => {
    return itemPrices
        .map((item: WeeklyLeaderboardItemPrice) => ({
            id: `rank-${weekId}-${item.custom_rank}`,
            itemCode: item.item_code,
            itemName: item.item_name,
            position: item.custom_rank,
            unitSalesPrice: item.price_list_rate,
            rewardValue: item.custom_minimum_reward_rate,
            minReward: item.custom_minimum_reward_rate,
            isSelected: false,
            status: item.status,
        }))
        .sort((a: LeaderboardRanking, b: LeaderboardRanking) => a.position - b.position);
};
