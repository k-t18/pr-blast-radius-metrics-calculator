import { type ReactElement, type ReactNode } from 'react';
import PerformanceMetricsCard from '../../../components/cards/PerformanceMetricsCard';
import { DeviceMobileCamera, Money, Television, User } from '../../../components/icons';
import { useWinnerCards } from '../../../hooks/winners/useWinners';
import type { WinnerCard } from '../../../services/winners/getWinnerCards.api';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';

const ICON_MAP: Record<string, ReactElement> = {
    'Total Winners Sponsored': <User size={24} />,
    'Total Amount Disbursed': <Money size={24} />,
    'Studio Show Winners': <Television size={24} />,
    'Mobile Game Winners': <DeviceMobileCamera size={24} />,
};

function formatValue(card: WinnerCard): ReactNode {
    const suffixText = card.suffix?.trim() ?? '';

    // Show a Yen symbol and keep the amount nicely formatted
    if (card.currency === 'Y') {
        return (
            <span className="flex items-baseline gap-2">
                <CurrencySymbol />
                <CurrencyAmount value={card.value} />
                {suffixText && <span className="text-xl leading-none">{suffixText}</span>}
            </span>
        );
    }

    const suffix = suffixText ? ` ${suffixText}` : '';
    return `${card.value}${suffix}`.trim();
}

function WinnersInfoCard() {
    const { data: cards, isLoading, error, refetch } = useWinnerCards();

    if (error) {
        return (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700">
                <div className="mb-2 font-semibold">Failed to load winner stats</div>
                <button type="button" className="text-sm underline" onClick={() => refetch()}>
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {isLoading &&
                    ['winner-card-skeleton-1', 'winner-card-skeleton-2', 'winner-card-skeleton-3', 'winner-card-skeleton-4'].map(key => (
                        <div key={key} className="h-32 rounded border border-gray-200 bg-gray-50" />
                    ))}

                {!isLoading &&
                    cards.map(card => (
                        <PerformanceMetricsCard
                            key={card.label}
                            icon={ICON_MAP[card.label] ?? <Money size={24} />}
                            value={formatValue(card)}
                            label={card.label}
                            changePercentage={card.changeType ? card.changePercentage : undefined}
                            changeType={card.changeType || undefined}
                        />
                    ))}
            </div>
        </div>
    );
}

export default WinnersInfoCard;
