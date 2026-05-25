import PerformanceMetricsCard from '../../../components/cards/PerformanceMetricsCard';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { User, Money, GameController, Play } from '../../../components/icons';
import type { SummaryCardProperties } from '../../../interfaces/adsCampaign/adsCampaign.types';
import type { PerformanceMetricsSummary } from './MobileGameTabContent';

interface PerformanceMetricsCardContainerProperties {
    summary: PerformanceMetricsSummary;
    engagementMetrics?: SummaryCardProperties[];
    showOnlyEngagementMetrics?: boolean;
    audienceReachMetrics?: SummaryCardProperties[];
    showOnlyAudienceReachMetrics?: boolean;
    adBreakMetrics?: SummaryCardProperties[];
    showOnlyAdBreakMetrics?: boolean;
}

// Formatter functions
const formatWithM = (value: number): string => {
    if (Number.isNaN(value)) return '0 M';
    const formatted = value % 1 === 0 ? value.toString() : value.toFixed(1);
    return `${formatted} M`;
};

export function PerformanceMetricsCardContainer({
    summary,
    engagementMetrics,
    showOnlyEngagementMetrics = false,
    audienceReachMetrics,
    showOnlyAudienceReachMetrics = false,
    adBreakMetrics,
    showOnlyAdBreakMetrics = false,
}: PerformanceMetricsCardContainerProperties) {
    // First row: General Performance Metrics
    const generalMetrics: SummaryCardProperties[] = [
        {
            icon: <User size={24} />,
            value: <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">{formatWithM(summary.totalPlayers)}</span>,
            label: 'Total Players',
            changePercentage: summary.changePercentage,
            changeType: 'increase',
        },
        {
            icon: <GameController size={24} />,
            value: <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">{formatWithM(summary.totalAppDownloads)}</span>,
            label: 'Total App Downloads',
            changePercentage: summary.changePercentage,
            changeType: 'increase',
        },
        {
            icon: <Play size={24} />,
            value: <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">{formatWithM(summary.avgGameSessionsPerDay)}</span>,
            label: 'Avg. Game Sessions/ Day',
            changePercentage: summary.changePercentage,
            changeType: 'decrease',
        },
        {
            icon: <Money size={24} />,
            value: (
                <>
                    <CurrencySymbol className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal" />
                    <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">{summary.prizesAmountRewarded}</span>
                </>
            ),
            label: 'Prizes Amount Rewarded',
            changePercentage: summary.changePercentage,
            changeType: 'increase',
        },
    ];

    const rewardMetrics: SummaryCardProperties[] = [
        {
            icon: <User size={24} />,
            value: <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">{formatWithM(summary.monthlyActiveUsers)}</span>,
            label: 'Monthly Active Users',
            changePercentage: summary.changePercentage,
            changeType: 'increase',
        },
        {
            icon: <User size={24} />,
            value: <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">{formatWithM(summary.dailyActiveUsers)}</span>,
            label: 'Daily Active Users',
            changePercentage: summary.changePercentage,
            changeType: 'increase',
        },
    ];

    // If showOnlyAdBreakMetrics is true, show only ad break metrics
    if (showOnlyAdBreakMetrics && adBreakMetrics && adBreakMetrics.length > 0) {
        return (
            <div className="mb-8">
                {/* Ad Break Metrics Row Only */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {adBreakMetrics.map(card => (
                        <PerformanceMetricsCard
                            key={card.label}
                            icon={card.icon}
                            value={card.value}
                            label={card.label}
                            changePercentage={card.changePercentage}
                            changeType={card.changeType}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // If showOnlyAudienceReachMetrics is true, show only audience reach metrics
    if (showOnlyAudienceReachMetrics && audienceReachMetrics && audienceReachMetrics.length > 0) {
        return (
            <div className="mb-8">
                {/* Audience Reach Metrics Row Only */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {audienceReachMetrics.map(card => (
                        <PerformanceMetricsCard
                            key={card.label}
                            icon={card.icon}
                            value={card.value}
                            label={card.label}
                            changePercentage={card.changePercentage}
                            changeType={card.changeType}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // If showOnlyEngagementMetrics is true, show only engagement metrics
    if (showOnlyEngagementMetrics && engagementMetrics && engagementMetrics.length > 0) {
        return (
            <div className="mb-8">
                {/* Engagement Metrics Row Only */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {engagementMetrics.map(card => (
                        <PerformanceMetricsCard
                            key={card.label}
                            icon={card.icon}
                            value={card.value}
                            label={card.label}
                            changePercentage={card.changePercentage}
                            changeType={card.changeType}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            {/* <HeaderTitle text="Over All Performace Metrics" size="xl" weight="medium" disabled={false} className="mb-6" /> */}

            {/* First Row: General Performance Metrics */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {generalMetrics.map(card => (
                    <PerformanceMetricsCard
                        key={card.label}
                        icon={card.icon}
                        value={card.value}
                        label={card.label}
                        changePercentage={card.changePercentage}
                        changeType={card.changeType}
                    />
                ))}
            </div>

            {/* Second Row: Reward Campaign Metrics */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                {rewardMetrics.map(card => (
                    <PerformanceMetricsCard
                        key={card.label}
                        icon={card.icon}
                        value={card.value}
                        label={card.label}
                        changePercentage={card.changePercentage}
                        changeType={card.changeType}
                    />
                ))}
            </div>
        </div>
    );
}
