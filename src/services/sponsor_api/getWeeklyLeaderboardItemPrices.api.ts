import { api } from '../api/apiClient';

export interface WeeklyLeaderboardItemPrice {
    item_code: string;
    item_name: string;
    price_list: string;
    price_list_rate: number;
    currency: string;
    custom_minimum_reward_rate: number;
    custom_rank: number;
    status: 'Available' | 'Booked';
}

export interface WeeklyLeaderboardItemPrices {
    item_prices: WeeklyLeaderboardItemPrice[];
}

export interface WeeklyLeaderboardItemPricesAPIResponse {
    data: WeeklyLeaderboardItemPrices;
}

/**
 * Fetches the weekly leaderboard rankings and pricing for a specific start date.
 * @param startDate - The start date in YYYY-MM-DD format
 * @returns Promise with item prices and statuses
 */
export const getWeeklyLeaderboardItemPrices = (startDate: string) => {
    return api.get<WeeklyLeaderboardItemPricesAPIResponse>(
        `/api/method/chances_game.api.sponsor_api.v1.target_audience.get_weekly_leaderboard_item_prices?start_date=${startDate}`
    );
};
