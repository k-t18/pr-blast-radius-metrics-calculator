import type { CirclePieChartDataPoint } from '../../../components/charts/CirclePieChart';
import type { SingleLineChartDataPoint } from '../../../components/charts/SingleLineChart';
import type { BarChartDataPoint } from '../../../components/charts/SingleBarChart';
import type { PieChartDataPoint } from '../../../components/charts/PieChart';

export interface PerformanceMetricsSummary {
    totalPlayers: number;
    totalAppDownloads: number;
    avgGameSessionsPerDay: number;
    prizesAmountRewarded: number;
    monthlyActiveUsers: number;
    dailyActiveUsers: number;
    changePercentage: number;
    // New engagement metrics
    engagementGrowth: number;
    avgTimePerSession: number;
    retentionRate: number;
    weeklyReturningUsers: number;
}

export const PERFORMANCE_METRICS_SUMMARY: PerformanceMetricsSummary = {
    totalPlayers: 14,
    totalAppDownloads: 23.3,
    avgGameSessionsPerDay: 120_000,
    prizesAmountRewarded: 10_585_000,
    monthlyActiveUsers: 14,
    dailyActiveUsers: 11.2,
    changePercentage: 2.3,
    engagementGrowth: 18,
    avgTimePerSession: 7.4,
    retentionRate: 42,
    weeklyReturningUsers: 63,
};

// Player Distribution by OS Data - Based on the image description (53% Android, 47% iOS)
export const playerDistributionByOSData: CirclePieChartDataPoint[] = [
    { name: 'Android', value: 53_000 },
    { name: 'iOS', value: 47_000 },
];

// Engagement by Days of the Week Data - Based on the image description
export const engagementByDaysOfWeekData: BarChartDataPoint[] = [
    { name: 'Monday', value: 45_000 },
    { name: 'Tuesday', value: 28_000 },
    { name: 'Wednesday', value: 3000 },
    { name: 'Thursday', value: 64_000 },
    { name: 'Friday', value: 42_000 },
    { name: 'Saturday', value: 95_000 },
    { name: 'Sunday', value: 35_000 },
];

// Avg. Engagement by Time of Day Data - Based on the image description
export const avgEngagementByTimeOfDayData: SingleLineChartDataPoint[] = [
    { date: '12 am', value: 48_000 },
    { date: '1 am', value: 38_000 },
    { date: '2 am', value: 60_000 },
    { date: '3 am', value: 25_000 },
    { date: '4 am', value: 22_000 },
    { date: '5 am', value: 7000 },
    { date: '6 am', value: 95_000 },
    { date: '7 am', value: 98_000 },
    { date: '8 am', value: 70_000 },
    { date: '9 am', value: 50_000 },
    { date: '10 am', value: 68_000 },
    { date: '11 am', value: 60_000 },
    { date: '12 pm', value: 98_000 },
    { date: '1 pm', value: 22_000 },
    { date: '2 pm', value: 95_000 },
    { date: '3 pm', value: 5000 },
    { date: '4 pm', value: 20_000 },
    { date: '5 pm', value: 28_000 },
    { date: '6 pm', value: 38_000 },
    { date: '7 pm', value: 30_000 },
    { date: '8 pm', value: 35_000 },
    { date: '9 pm', value: 75_000 },
    { date: '10 pm', value: 50_000 },
    { date: '11 pm', value: 88_000 },
];

// Telco Usage Correlation Data - Based on the image description
export const telcoUsageCorrelationData: PieChartDataPoint[] = [
    { name: 'Airtel', value: 33 },
    { name: 'MTN', value: 28 },
    { name: 'Glo', value: 23 },
    { name: '9 mobile', value: 16 },
];
