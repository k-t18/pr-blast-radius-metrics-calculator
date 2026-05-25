import type { ReactNode } from 'react';
import PerformanceMetricsCard from '../../../components/cards/PerformanceMetricsCard';
import { Building, Money } from '../../../components/icons';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';

interface CsrCardItem {
    label: string;
    value: number;
    changePercentage: number;
    changeType: string;
    suffix: string;
    currency: string;
}

const formatValue = (item?: CsrCardItem): ReactNode => {
    if (!item) {
        return <span className="flex items-baseline gap-2 font-ubuntu font-medium text-[32px] leading-10 text-charcoal">0</span>;
    }

    const suffix = item.suffix?.trim() ?? '';
    const formattedValue = Number.isInteger(item.value) ? item.value.toString() : item.value.toFixed(2);
    const showCurrencySymbol = item.currency === 'Y';

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

function CsrCards({ csrCardSummary, isLoading, error }: { csrCardSummary: CsrCardItem[] | undefined; isLoading: boolean; error: Error | null }) {
    if (isLoading) {
        return (
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map(index => (
                    <div key={index} className="h-50 w-full animate-pulse rounded border border-gray-200 bg-gray-50" />
                ))}
            </div>
        );
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const dataList = Array.isArray(csrCardSummary) ? (csrCardSummary as CsrCardItem[]) : [];

    // Match labels exactly as they appear in the API response
    const totalDonationItem = dataList.find(item => item.label === 'Total Donation Made' || item.label === 'Total Donations Made');
    const ngoSupportedItem = dataList.find(item => item.label === "NGO's Supported" || item.label === 'NGOs Supported');

    const generalMetrics = [
        {
            icon: <Money size={24} />,
            value: formatValue(totalDonationItem),
            label: 'Total Donations Made',
            changePercentage: totalDonationItem?.changePercentage,
            changeType: totalDonationItem?.changeType,
        },
        {
            icon: <Building size={24} />,
            value: formatValue(ngoSupportedItem),
            label: 'NGOs Supported',
            changePercentage: ngoSupportedItem?.changePercentage,
            changeType: ngoSupportedItem?.changeType,
        },
    ];

    return (
        <div>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {generalMetrics.map(card => (
                    <PerformanceMetricsCard
                        key={card.label}
                        icon={card.icon}
                        value={card.value}
                        label={card.label}
                        changePercentage={card.changePercentage}
                        changeType={card.changeType as 'increase' | 'decrease' | undefined}
                    />
                ))}
            </div>
        </div>
    );
}

export default CsrCards;
