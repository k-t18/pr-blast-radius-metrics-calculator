import type { SingleLineChartDataPoint } from '../../../components/charts/SingleLineChart';
import type { CirclePieChartDataPoint } from '../../../components/charts/CirclePieChart';
import type { VerticalBarChartDataPoint } from '../../../components/charts/VerticalSingleBarChart';
import type { StackedBarChartDataPoint } from '../../../components/charts/StackedBarChart';
import type { RegionReachData } from '../../../components/charts/NigeriaMap';

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
    // Audience Reach and Exposure metrics
    uniqueWeeklyViewers: number;
    avgWatchTimePerViewer: number;
    peakConcurrentViewers: number;
    audienceRetentionRate: number;
    // Ad Break and Mobile Game metrics
    qrCodeScansDuringAdBreaks: number;
    viewersWhoPlayMobileGame: number;
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
    // Audience Reach and Exposure metrics
    uniqueWeeklyViewers: 7,
    avgWatchTimePerViewer: 23.5,
    peakConcurrentViewers: 5.3,
    audienceRetentionRate: 84,
    // Ad Break and Mobile Game metrics
    qrCodeScansDuringAdBreaks: 12_430,
    viewersWhoPlayMobileGame: 24_600,
};

// Growth in Users Data - Based on the image description
export const growthInUsersData: SingleLineChartDataPoint[] = [
    { date: '09/10', value: 49_000 },
    { date: '09/11', value: 39_000 },
    { date: '09/12', value: 60_000 },
    { date: '09/13', value: 24_000 },
    { date: '09/14', value: 22_000 },
    { date: '09/15', value: 7000 },
    { date: '09/16', value: 95_000 },
    { date: '09/17', value: 99_000 },
    { date: '09/18', value: 69_000 },
    { date: '09/19', value: 51_000 },
    { date: '09/20', value: 64_000 },
    { date: '09/21', value: 60_000 },
    { date: '09/22', value: 82_000 },
    { date: '09/23', value: 20_000 },
    { date: '09/24', value: 2000 },
    { date: '09/25', value: 18_000 },
    { date: '09/26', value: 28_000 },
    { date: '09/27', value: 35_000 },
    { date: '09/28', value: 29_000 },
    { date: '09/29', value: 52_000 },
    { date: '09/30', value: 78_000 },
    { date: '10/01', value: 51_000 },
    { date: '10/02', value: 90_000 },
];

// Gender Distribution Data - Based on the image description (53% Male, 47% Female)
export const genderDistributionData: CirclePieChartDataPoint[] = [
    { name: 'Male', value: 53 },
    { name: 'Female', value: 47 },
];

// Platform Split (TV vs Online) Data - Based on the image description (53% TV, 47% Online)
export const platformSplitData: CirclePieChartDataPoint[] = [
    { name: 'TV', value: 53 },
    { name: 'Online', value: 47 },
];

// Player Distribution by OS Data - Based on the image description (53% Android, 47% iOS)
export const playerDistributionByOSData: CirclePieChartDataPoint[] = [
    { name: 'Android', value: 53_000 },
    { name: 'iOS', value: 47_000 },
];

// Reach by Region Data - Based on the image description
// Abuja shows 17,000 in tooltip, various states have different reach values
export const reachByRegionData: RegionReachData[] = [
    // { state: 'FCT-Abuja', reach: 17_000 },
    { state: 'Federal Capital Territory', value: 17_000 },
    { state: 'Lagos', value: 0 },
    { state: 'Kano', value: 16_000 },
    { state: 'Rivers', value: 0 },
    { state: 'Kaduna', value: 0 },
    { state: 'Oyo', value: 0 },
    { state: 'Delta', value: 0 },
    { state: 'Plateau', value: 11_000 },
    { state: 'Enugu', value: 0 },
    { state: 'Kano', value: 16_000 },
    { state: 'Katsina', value: 0 },
    { state: 'Borno', value: 0 },
    { state: 'Bauchi', value: 0 },
    { state: 'Anambra', value: 0 },
    { state: 'Imo', value: 0 },
    { state: 'Akwa Ibom', value: 0 },
    { state: 'Cross River', value: 4_000 },
    { state: 'Edo', value: 6_000 },
    { state: 'Ogun', value: 0 },
    { state: 'Osun', value: 0 },
    { state: 'Kwara', value: 4_000 },
    { state: 'Benue', value: 0 },
    { state: 'Niger', value: 6_000 },
    { state: 'Sokoto', value: 0 },
    { state: 'Zamfara', value: 0 },
    { state: 'Kebbi', value: 0 },
    { state: 'Yobe', value: 9_000 },
    { state: 'Gombe', value: 6_000 },
    { state: 'Adamawa', value: 7_000 },
    { state: 'Taraba', value: 0 },
    { state: 'Nasarawa', value: 3_000 },
    { state: 'Kogi', value: 0 },
    { state: 'Ekiti', value: 0 },
    { state: 'Ondo', value: 0 },
    { state: 'Ebonyi', value: 0 },
    { state: 'Bayelsa', value: 0 },
    { state: 'Abia', value: 0 },
];

// Top 5 Cities by Player Count Data - Based on the image description
// Order: Lagos, Abuja, Port Harcourt, Ibadan, Kaduna (from top to bottom)
export const topCitiesByPlayerCountData: VerticalBarChartDataPoint[] = [
    { name: 'Lagos', value: 28_000 },
    { name: 'Abuja', value: 18_000 },
    { name: 'Port Harcourt', value: 55_000 },
    { name: 'Ibadan', value: 7000 },
    { name: 'Kaduna', value: 13_000 },
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

// Episode Retention Curve Data - Based on the image description
export const episodeRetentionCurveData: SingleLineChartDataPoint[] = [
    { date: '0', value: 65_000 },
    { date: '1', value: 60_000 },
    { date: '2', value: 50_000 },
    { date: '3', value: 50_000 },
    { date: '4', value: 85_000 },
    { date: '5', value: 70_000 },
    { date: '6', value: 70_000 },
    { date: '7', value: 50_000 },
    { date: '8', value: 20_000 },
    { date: '9', value: 85_000 },
    { date: '10', value: 85_000 },
    { date: '11', value: 55_000 },
    { date: '12', value: 75_000 },
    { date: '13', value: 10_000 },
    { date: '14', value: 95_000 },
    { date: '15', value: 20_000 },
    { date: '16', value: 85_000 },
    { date: '17', value: 60_000 },
    { date: '18', value: 85_000 },
    { date: '19', value: 75_000 },
    { date: '20', value: 10_000 },
    { date: '21', value: 45_000 },
    { date: '22', value: 0 },
    { date: '23', value: 55_000 },
    { date: '24', value: 10_000 },
    { date: '25', value: 80_000 },
    { date: '26', value: 10_000 },
    { date: '27', value: 10_000 },
    { date: '28', value: 80_000 },
    { date: '29', value: 25_000 },
];

// Audience Interaction Rate Data - Based on the image description
export const audienceInteractionRateData: StackedBarChartDataPoint[] = [
    { name: 'Episode 1', Polls: 35_000, Votes: 28_000, SMS: 20_000 },
    { name: 'Episode 2', Polls: 20_000, Votes: 65_000, SMS: 8000 },
    { name: 'Episode 3', Polls: 48_000, Votes: 25_000, SMS: 15_000 },
    { name: 'Episode 4', Polls: 43_000, Votes: 12_000, SMS: 30_000 },
    { name: 'Episode 5', Polls: 15_000, Votes: 30_000, SMS: 50_000 },
    { name: 'Episode 6', Polls: 35_000, Votes: 8000, SMS: 20_000 },
    { name: 'Episode 7', Polls: 30_000, Votes: 5000, SMS: 12_000 },
];

// Average Viewership per Episode Data - Based on the image description
export const averageViewershipPerEpisodeData: SingleLineChartDataPoint[] = [
    { date: 'Episode 1', value: 275_000 },
    { date: 'Episode 2', value: 580_000 },
    { date: 'Episode 3', value: 400_000 },
    { date: 'Episode 4', value: 150_000 },
    { date: 'Episode 5', value: 450_000 },
    { date: 'Episode 6', value: 380_000 },
    { date: 'Episode 7', value: 580_000 },
];
