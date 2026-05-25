import PaymentSummaryCard from '../../../components/cards/PaymentSummaryCard';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { Money, Invoice } from '../../../components/icons';
import Warning from '../../../components/icons/Warning';
import type { SummaryCardProperties } from '../../../interfaces/payments/payments.types';
import { useInvoiceCardMetrics } from '../../../hooks/payments/useInvoiceCardMetrics';

export function PaymentCardContainer() {
    // Fetch invoice card metrics from API
    const { totalPaid, unpaid, overdue, isLoading, error } = useInvoiceCardMetrics();

    const cards: SummaryCardProperties[] = [
        {
            icon: <Money size={24} />,
            value: (
                <>
                    <CurrencySymbol className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal" />
                    <CurrencyAmount value={totalPaid} className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal" />
                </>
            ),
            label: 'Total Amount Paid',
            isLoading,
            error,
        },
        {
            icon: <Invoice size={24} />,
            value: <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">{unpaid}</span>,
            label: 'Unpaid',
            isLoading,
            error,
        },
        {
            icon: <Warning size={24} />,
            value: <span className="font-ubuntu font-medium text-[32px] leading-10 text-charcoal">{overdue}</span>,
            label: 'Overdue',
            isLoading,
            error,
        },
    ];

    return (
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map(card => (
                <PaymentSummaryCard key={card.label} icon={card.icon} value={card.value} label={card.label} isLoading={card.isLoading} />
            ))}
        </div>
    );
}
