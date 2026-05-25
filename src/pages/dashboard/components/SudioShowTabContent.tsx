import { PerformanceMetricsCardContainer } from './PerformanceMetricsCardContainer';
import SingleLineChart from '../../../components/charts/SingleLineChart';
import CirclePieChart from '../../../components/charts/CirclePieChart';
import VerticalSingleBarChart from '../../../components/charts/VerticalSingleBarChart';
import StackedBarChart from '../../../components/charts/StackedBarChart';
import NigeriaMap from '../../../components/charts/NigeriaMap';
import HeaderTitle from '../../../components/common/HeaderTitle';
import SponsorshipAd from './SponsorshipAd';
import { Play, User, Clock, GameController, Percent } from '../../../components/icons';
import { PeriodFilterSelection } from '../../../components/common/PeriodFilterSelection';
import useFetchStudioShowDashboardData from '../hooks/useFetchStudioShowDashboardData';
import { type DashboardTabContentProperties } from '../dataset/dashboardDataSets';
import { renderChartWithState } from './RenderChartWithState';
import {
    PERFORMANCE_METRICS_SUMMARY,
    platformSplitData,
    reachByRegionData,
    episodeRetentionCurveData,
    audienceInteractionRateData,
    averageViewershipPerEpisodeData,
} from '../dataset/studioShowDataset';

// Re-export for backward compatibility if needed
export type { PerformanceMetricsSummary } from '../dataset/studioShowDataset';
export { PERFORMANCE_METRICS_SUMMARY } from '../dataset/studioShowDataset';

// Formatter function for values with M suffix
const formatWithM = (value: number): string => {
    if (Number.isNaN(value)) return '0 M';
    const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
    return `${formatted} M`;
};

function SudioShowTabContent({ sponsorshipType, periodData, selectedDateFormat, onPeriodChange, isPeriodReady }: DashboardTabContentProperties) {
    const {
        genderDistributionData: genderDistributionApiData,
        topCitiesData: topCitiesApiData,
        topCitiesYAxisDomain,
        isLoadingGenderDistribution,
        isLoadingTopCities,
        errorGenderDistribution,
        errorTopCities,
    } = useFetchStudioShowDashboardData({ dateFormat: selectedDateFormat, sponsorshipType, enabled: isPeriodReady });

    // Audience Reach and Exposure Cards Data
    const audienceReachCards = [
        {
            icon: <User size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {formatWithM(PERFORMANCE_METRICS_SUMMARY.uniqueWeeklyViewers)}
                </span>
            ),
            label: 'Unique Weekly Viewers',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'decrease' as const,
        },
        {
            icon: <Clock size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {PERFORMANCE_METRICS_SUMMARY.avgWatchTimePerViewer} mins
                </span>
            ),
            label: 'Average Watch Time per Viewer',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
        {
            icon: <GameController size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {formatWithM(PERFORMANCE_METRICS_SUMMARY.peakConcurrentViewers)}
                </span>
            ),
            label: 'Peak Concurrent Viewers',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
        {
            icon: <Percent size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {PERFORMANCE_METRICS_SUMMARY.audienceRetentionRate % 1 === 0
                        ? PERFORMANCE_METRICS_SUMMARY.audienceRetentionRate.toString()
                        : PERFORMANCE_METRICS_SUMMARY.audienceRetentionRate.toFixed(2)}
                    %
                </span>
            ),
            label: 'Retention Rate',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
    ];

    // Ad Break and Mobile Game Metrics Cards Data
    const adBreakMetricsCards = [
        {
            icon: <Play size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {PERFORMANCE_METRICS_SUMMARY.qrCodeScansDuringAdBreaks.toLocaleString()}
                </span>
            ),
            label: 'QR Code Scans During Ad Breaks',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
        {
            icon: <GameController size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {PERFORMANCE_METRICS_SUMMARY.viewersWhoPlayMobileGame.toLocaleString()}
                </span>
            ),
            label: 'Viewers who play the mobile game',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
    ];

    return (
        <div>
            {/* Audience Reach and Exposure Section */}
            <div className="mb-4 flex items-center justify-between">
                <HeaderTitle text="Audience Reach and Exposure" size="2xl" weight="medium" disabled={false} className="font-ubuntu" />
                <div className="flex items-center gap-2">
                    <PeriodFilterSelection periodData={periodData} selectedValue={selectedDateFormat} onChange={onPeriodChange} />
                </div>
            </div>

            {/* Audience Reach Cards */}
            <div className="mb-6">
                <PerformanceMetricsCardContainer
                    summary={PERFORMANCE_METRICS_SUMMARY}
                    audienceReachMetrics={audienceReachCards}
                    showOnlyAudienceReachMetrics
                />
            </div>

            {/* Average Viewership per Episode Chart */}
            <div className="mb-6">
                <SingleLineChart
                    data={averageViewershipPerEpisodeData}
                    title="Average Viewership per Episode"
                    lineKey="value"
                    lineName="Viewership"
                    lineColor="#6A0DAD"
                    yAxisDomain={[0, 600_000]}
                    height={500}
                />
            </div>

            <hr className="border-border-gray-600 my-8" />
            <HeaderTitle text="Audience Demographic" size="2xl" weight="medium" disabled={false} className="mb-4 font-ubuntu" />

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="h-full">
                    {renderChartWithState({
                        isLoading: isLoadingGenderDistribution,
                        error: errorGenderDistribution,
                        dataLength: genderDistributionApiData.length,
                        height: 400,
                        children: (
                            <CirclePieChart
                                data={genderDistributionApiData}
                                title="Gender Distribution"
                                colors={['#6A0DAD', '#FFD700']}
                                height={400}
                            />
                        ),
                    })}
                </div>
                <div className="h-full">
                    <CirclePieChart data={platformSplitData} title="Platform Split (TV vs Online)" colors={['#6A0DAD', '#FFD700']} height={400} />
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Map section  */}
                <div>
                    <NigeriaMap data={reachByRegionData} title="Reach by Region" height={500} />
                </div>
                <div>
                    {renderChartWithState({
                        isLoading: isLoadingTopCities,
                        error: errorTopCities,
                        dataLength: topCitiesApiData.length,
                        height: 500,
                        children: (
                            <VerticalSingleBarChart
                                data={topCitiesApiData}
                                title="Top 5 cities by player count"
                                barKey="value"
                                barName="Players"
                                barColor="#6A0DAD"
                                xAxisDomain={topCitiesYAxisDomain ?? [0, 60_000]}
                                height={500}
                            />
                        ),
                    })}
                </div>
            </div>

            <hr className="border-border-gray-600 my-8" />
            <HeaderTitle text="Engagement Metrics" size="2xl" weight="medium" disabled={false} className="mb-4 font-ubuntu" />

            <div className="mb-6">
                <SingleLineChart
                    data={episodeRetentionCurveData}
                    title="Episode Retention Curve"
                    lineKey="value"
                    lineName="Retention"
                    lineColor="#6A0DAD"
                    yAxisDomain={[0, 100_000]}
                    height={500}
                />
            </div>

            {/* Sponsorship Ad and Engagement Chart Section at the End */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-11">
                <div className="lg:col-span-4 h-full">
                    <SponsorshipAd />
                </div>
                <div className="lg:col-span-7 h-full">
                    <StackedBarChart
                        data={audienceInteractionRateData}
                        title="Audience Interaction Rate"
                        stackKeys={[
                            { key: 'Polls', name: 'Polls', color: '#6A0DAD' },
                            { key: 'Votes', name: 'Votes', color: '#FFD700' },
                            { key: 'SMS', name: 'SMS', color: '#FF6F61' },
                        ]}
                        yAxisDomain={[0, 100_000]}
                        height={400}
                    />
                </div>
            </div>
            {/* Ad Break and Mobile Game Metrics Cards */}
            <div className="mb-6">
                <PerformanceMetricsCardContainer summary={PERFORMANCE_METRICS_SUMMARY} adBreakMetrics={adBreakMetricsCards} showOnlyAdBreakMetrics />
            </div>
        </div>
    );
}

export default SudioShowTabContent;
