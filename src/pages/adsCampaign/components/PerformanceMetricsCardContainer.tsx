import { type ReactNode } from 'react';
import PerformanceMetricsCard from '../../../components/cards/PerformanceMetricsCard';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { PeriodFilterSelection } from '../../../components/common/PeriodFilterSelection';
// import type { DropdownOption } from '../../../components/common/Dropdown';
import { User, Eye, HandPointing, Percent, Money } from '../../../components/icons';
import type { AdsCampaignMetricCard, SummaryCardProperties } from '../../../interfaces/adsCampaign/adsCampaign.types';
import type { PeriodDataOption } from '../../../services/general/getPeriodData.api';

interface PerformanceMetricsCardContainerProperties {
    overallCards: AdsCampaignMetricCard[];
    rewardCards: AdsCampaignMetricCard[];
    isLoading?: boolean;
    periodData: PeriodDataOption[];
    selectedValue?: number;
    onPeriodChange: (value: number | undefined) => void;
}

const ICON_MAP: Record<string, ReactNode> = {
    'Total Reach': <User size={24} />,
    'Total Impressions': <Eye size={24} />,
    'Total Clicks': <HandPointing size={24} />,
    'Clickthrough Rate': <Percent size={24} />,
    'Click Through Rate': <Percent size={24} />,
    'Total Amount Declared': <Money size={24} />,
    'Total Amount Redeemed': <Money size={24} />,
    'Outstanding Rewards': <Money size={24} />,
    'Redemption Rate': <Percent size={24} />,
};

const formatCardValue = (card: AdsCampaignMetricCard): ReactNode => {
    const suffix = card.suffix?.trim();
    const formattedValue = Number.isInteger(card.value) ? card.value.toString() : card.value.toFixed(2);

    const showCurrencySymbol = card.currency === 'Y';

    if (showCurrencySymbol) {
        return (
            <span className="flex items-baseline gap-2 font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
                <CurrencySymbol symbol="₦" className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal" />
                <span>{formattedValue}</span>
                {suffix && <span className="text-xl leading-none">{suffix}</span>}
            </span>
        );
    }

    return (
        <span className="flex items-baseline gap-2 font-ubuntu font-medium text-[32px] leading-10 text-charcoal">
            <span>{formattedValue}</span>
            {suffix && <span className="text-xl leading-none">{suffix}</span>}
        </span>
    );
};

const toCardProperties = (card: AdsCampaignMetricCard): SummaryCardProperties => ({
    icon: ICON_MAP[card.label] ?? <Money size={24} />,
    value: formatCardValue(card),
    label: card.label,
    changePercentage: card.changePercentage,
    changeType: card.changeType || undefined,
});

const renderSkeletonRow = (count: number) => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
            <div key={`metrics-card-skeleton-${index + 1}`} className="h-32 rounded border border-gray-200 bg-gray-50" />
        ))}
    </div>
);

export function PerformanceMetricsCardContainer({
    overallCards,
    rewardCards,
    isLoading = false,
    periodData,
    selectedValue,
    onPeriodChange,
}: PerformanceMetricsCardContainerProperties) {
    const overallMetrics: SummaryCardProperties[] = overallCards.map(card => toCardProperties(card));
    const rewardMetrics: SummaryCardProperties[] = rewardCards.map(card => toCardProperties(card));

    return (
        <div className="mb-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <HeaderTitle text="Over All Performace Metrics" size="xl" weight="medium" disabled={false} className="mb-0" />
                <PeriodFilterSelection periodData={periodData} selectedValue={selectedValue} onChange={onPeriodChange} />
            </div>

            {/* First Row: General Performance Metrics */}
            <div className="mb-8">
                {isLoading && renderSkeletonRow(4)}
                {!isLoading && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {overallMetrics.map(card => (
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
                )}
            </div>

            <HeaderTitle text="Reward Campaign Metrics" size="xl" weight="medium" disabled={false} className="mb-6" />

            {/* Second Row: Reward Campaign Metrics */}
            <div>
                {isLoading && renderSkeletonRow(4)}
                {!isLoading && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                )}
            </div>
        </div>
    );
}
