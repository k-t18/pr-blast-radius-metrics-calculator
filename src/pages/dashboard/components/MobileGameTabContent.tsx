import React from 'react';
import { PerformanceMetricsCardContainer } from './PerformanceMetricsCardContainer';
import SingleLineChart from '../../../components/charts/SingleLineChart';
import CirclePieChart from '../../../components/charts/CirclePieChart';
import SingleBarChart from '../../../components/charts/SingleBarChart';
import VerticalSingleBarChart from '../../../components/charts/VerticalSingleBarChart';
import PieChart from '../../../components/charts/PieChart';
import HeaderTitle from '../../../components/common/HeaderTitle';
import SponsorshipAd from './SponsorshipAd';
import { ChartBar, Play, ArrowsCounterClockwise, Money, User } from '../../../components/icons';
import { PeriodFilterSelection } from '../../../components/common/PeriodFilterSelection';
import useFetchMobileDashboardData from '../hooks/useFetchMobileDashboardData';
import { renderChartWithState, getErrorMessage } from './RenderChartWithState';
import { type DashboardTabContentProperties } from '../dataset/dashboardDataSets';
import NigeriaMap from '../../../components/charts/NigeriaMap';
import type { SummaryCardProperties } from '../../../interfaces/adsCampaign/adsCampaign.types';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import {
    PERFORMANCE_METRICS_SUMMARY,
    playerDistributionByOSData,
    engagementByDaysOfWeekData,
    avgEngagementByTimeOfDayData,
    telcoUsageCorrelationData,
} from '../dataset/mobileGameDataset';

// Re-export for backward compatibility if needed
export type { PerformanceMetricsSummary } from '../dataset/mobileGameDataset';
export { PERFORMANCE_METRICS_SUMMARY } from '../dataset/mobileGameDataset';

function MobileGameTabContent({ periodData, selectedDateFormat, onPeriodChange, sponsorshipType, isPeriodReady }: DashboardTabContentProperties) {
    const {
        growthInUsersData: growthInUsersApiData,
        growthYAxisDomain,
        genderDistributionData: genderDistributionApiData,
        ageGroupsData: ageGroupsApiData,
        ageGroupYAxisDomain,
        educationData: educationApiData,
        educationYAxisDomain,
        topCitiesData: topCitiesApiData,
        topCitiesYAxisDomain,
        interestsOfPlayersData: interestsApiData,
        topPaymentMethodsData: topPaymentMethodsApiData,
        topPaymentMethodsYAxisDomain,
        audienceReachMetricsData,
        stateByPlayerCountData: stateByPlayerCountApiData,
        isLoadingAudienceReach,
        isLoadingGrowthInUsers,
        isLoadingGenderDistribution,
        isLoadingAgeGroupDistribution,
        isLoadingEducationDistribution,
        isLoadingTopCities,
        isLoadingInterests,
        isLoadingTopPaymentMethods,
        isLoadingStateByPlayerCount,
        errorAudienceReach,
        errorGrowthInUsers,
        errorGenderDistribution,
        errorAgeGroupDistribution,
        errorEducationDistribution,
        errorTopCities,
        errorInterests,
        errorTopPaymentMethods,
        errorStateByPlayerCount,
    } = useFetchMobileDashboardData({ dateFormat: selectedDateFormat, sponsorshipType, enabled: isPeriodReady });

    const AUDIENCE_REACH_ICON_MAP: Record<string, React.ReactNode> = {
        'Total Players': <User size={24} />,
        'Prizes Amount Rewarded': <Money size={24} />,
    };

    const renderAudienceReachMetrics = () => {
        if (errorAudienceReach) {
            return (
                <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
                    <div className="mb-2 font-semibold">Failed to load audience reach metrics</div>
                    <div className="text-sm mb-3">{getErrorMessage(errorAudienceReach)}</div>
                </div>
            );
        }

        if (!isPeriodReady || isLoadingAudienceReach) {
            return (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={`audience-reach-card-skeleton-${index + 1}`} className="h-32 rounded border border-gray-200 bg-gray-50" />
                    ))}
                </div>
            );
        }

        if (audienceReachMetricsData.length === 0) {
            return (
                <div className="rounded border border-gray-200 bg-white p-8 shadow-sm h-full rounded-lg flex items-center justify-center text-gray-500 font-ubuntu">
                    No Audience Reach data available
                </div>
            );
        }

        const audienceReachCards: SummaryCardProperties[] = audienceReachMetricsData.map(metric => {
            const formattedValue = Number.isInteger(metric.value) ? metric.value.toString() : metric.value.toFixed(2);
            const showCurrency = (metric as { currency?: 'Y' | 'N' }).currency === 'Y';

            return {
                icon: AUDIENCE_REACH_ICON_MAP[metric.label] ?? <User size={24} />,
                value: (
                    <span className="flex items-baseline gap-2 font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                        {showCurrency && <CurrencySymbol symbol="₦" className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal" />}
                        <span>{formattedValue}</span>
                        {metric.suffix && <span className="text-xl leading-none">{metric.suffix}</span>}
                    </span>
                ),
                label: metric.label,
                changePercentage: metric.changePercentage,
                changeType: metric.changeType === 'increase' || metric.changeType === 'decrease' ? metric.changeType : undefined,
            };
        });

        return (
            <PerformanceMetricsCardContainer
                summary={PERFORMANCE_METRICS_SUMMARY}
                audienceReachMetrics={audienceReachCards}
                showOnlyAudienceReachMetrics
            />
        );
    };
    // Engagement Metrics Cards Data
    const engagementMetricsCards = [
        {
            icon: <ChartBar size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {PERFORMANCE_METRICS_SUMMARY.engagementGrowth % 1 === 0
                        ? PERFORMANCE_METRICS_SUMMARY.engagementGrowth.toString()
                        : PERFORMANCE_METRICS_SUMMARY.engagementGrowth.toFixed(2)}{' '}
                    %
                </span>
            ),
            label: 'Engagement Growth',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
        {
            icon: <Play size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {PERFORMANCE_METRICS_SUMMARY.avgTimePerSession} mins
                </span>
            ),
            label: 'Avg. Time per Session',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
        {
            icon: <ArrowsCounterClockwise size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {PERFORMANCE_METRICS_SUMMARY.retentionRate % 1 === 0
                        ? PERFORMANCE_METRICS_SUMMARY.retentionRate.toString()
                        : PERFORMANCE_METRICS_SUMMARY.retentionRate.toFixed(2)}{' '}
                    %
                </span>
            ),
            label: 'Retention Rate',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
        {
            icon: <ArrowsCounterClockwise size={24} />,
            value: (
                <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                    {PERFORMANCE_METRICS_SUMMARY.weeklyReturningUsers % 1 === 0
                        ? PERFORMANCE_METRICS_SUMMARY.weeklyReturningUsers.toString()
                        : PERFORMANCE_METRICS_SUMMARY.weeklyReturningUsers.toFixed(2)}
                    %
                </span>
            ),
            label: 'Weekly returning users',
            changePercentage: PERFORMANCE_METRICS_SUMMARY.changePercentage,
            changeType: 'increase' as const,
        },
    ];

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <HeaderTitle text="Audience Reach and Exposure" size="2xl" weight="medium" disabled={false} className="font-ubuntu" />
                <div className="flex items-center gap-2">
                    <PeriodFilterSelection periodData={periodData} selectedValue={selectedDateFormat} onChange={onPeriodChange} />
                </div>
            </div>
            {/* API-powered audience reach metrics */}
            <div className="mb-6">{renderAudienceReachMetrics()}</div>

            {/* Existing charts below */}
            <div className="mb-6">
                {renderChartWithState({
                    isLoading: isLoadingGrowthInUsers,
                    error: errorGrowthInUsers,
                    dataLength: growthInUsersApiData.length,
                    height: 500,
                    children: (
                        <SingleLineChart
                            data={growthInUsersApiData}
                            title="Growth in Users"
                            lineKey="value"
                            lineName="Users"
                            lineColor="#6A0DAD"
                            yAxisDomain={growthYAxisDomain ?? [0, 100_000]}
                            height={500}
                        />
                    ),
                })}
            </div>

            <hr className="border-border-gray-600 my-8" />
            {/* Audience Demographic Section */}
            <div className="mb-4 flex items-center">
                <HeaderTitle text="Audience Demographic" size="2xl" weight="medium" disabled={false} className="font-ubuntu" />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2 h-full">
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
                <div className="lg:col-span-3 h-full">
                    {renderChartWithState({
                        isLoading: isLoadingAgeGroupDistribution,
                        error: errorAgeGroupDistribution,
                        dataLength: ageGroupsApiData.length,
                        height: 400,
                        children: (
                            <SingleBarChart
                                data={ageGroupsApiData}
                                title="Age Groups"
                                barKey="value"
                                barName="Users"
                                barColor="#6A0DAD"
                                yAxisDomain={ageGroupYAxisDomain ?? [0, 60_000]}
                                height={400}
                            />
                        ),
                    })}
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2 h-full">
                    <CirclePieChart
                        data={playerDistributionByOSData}
                        title="Player Distribution by OS"
                        colors={['#6A0DAD', '#FFD700']}
                        height={400}
                    />
                </div>
                <div className="lg:col-span-3 h-full">
                    {renderChartWithState({
                        isLoading: isLoadingEducationDistribution,
                        error: errorEducationDistribution,
                        dataLength: educationApiData.length,
                        height: 400,
                        children: (
                            <SingleBarChart
                                data={educationApiData}
                                title="Education level"
                                barKey="value"
                                barName="Users"
                                barColor="#6A0DAD"
                                yAxisDomain={educationYAxisDomain ?? [0, 60_000]}
                                height={400}
                            />
                        ),
                    })}
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Map section  */}
                <div>
                    <NigeriaMap
                        data={stateByPlayerCountApiData ?? []}
                        title="Player Density by States"
                        height={500}
                        isLoading={isLoadingStateByPlayerCount}
                        error={errorStateByPlayerCount}
                    />
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
                    data={avgEngagementByTimeOfDayData}
                    title="Avg. Engagement by Time of Day"
                    lineKey="value"
                    lineName="Engagement"
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
                    <SingleBarChart
                        data={engagementByDaysOfWeekData}
                        title="Engagement by days of the week"
                        barKey="value"
                        barName="Plays"
                        barColor="#6A0DAD"
                        yAxisDomain={[0, 100_000]}
                        height={400}
                        yAxisLabel=""
                        currencySymbol=""
                    />
                </div>
            </div>
            {/* Engagement Metrics Cards at Bottom - Show only 4 engagement cards */}
            <div className="mb-6">
                <PerformanceMetricsCardContainer
                    summary={PERFORMANCE_METRICS_SUMMARY}
                    engagementMetrics={engagementMetricsCards}
                    showOnlyEngagementMetrics
                />
            </div>

            <hr className="border-border-gray-600 my-8" />
            <HeaderTitle text="Audience Affinity & Lifestyle Clues" size="2xl" weight="medium" disabled={false} className="mb-4 font-ubuntu" />

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="h-full">
                    {renderChartWithState({
                        isLoading: isLoadingInterests,
                        error: errorInterests,
                        dataLength: interestsApiData.length,
                        height: 400,
                        children: (
                            <PieChart
                                data={interestsApiData}
                                title="Interests of Players"
                                colors={['#FF6F61', '#6A0DAD', '#FF69B4', '#4169E1', '#FFD700', '#20B2AA', '#000000']}
                                height={400}
                                legendPosition="top-right"
                            />
                        ),
                    })}
                </div>
                <div className="h-full">
                    <PieChart
                        data={telcoUsageCorrelationData}
                        title="Telco Usage Correlation"
                        colors={['#6A0DAD', '#FF6F61', '#20B2AA', '#FFD700']}
                        height={400}
                        legendPosition="top-right"
                    />
                </div>
            </div>
            <div className="mb-6">
                {renderChartWithState({
                    isLoading: isLoadingTopPaymentMethods,
                    error: errorTopPaymentMethods,
                    dataLength: topPaymentMethodsApiData.length,
                    height: 500,
                    children: (
                        <SingleBarChart
                            data={topPaymentMethodsApiData}
                            title="Top Payment Methods"
                            barKey="value"
                            barName="Transactions"
                            barColor="#6A0DAD"
                            yAxisDomain={topPaymentMethodsYAxisDomain ?? [0, 80_000]}
                            height={500}
                        />
                    ),
                })}
            </div>
        </div>
    );
}

export default MobileGameTabContent;
