import { useEffect } from 'react';
import { useApprovedBlanketOrders } from '../../hooks/blanketSponsorship/useBlanketOrders';
import { CurrencySymbol } from './CurrencySymbol';
import HeaderTitle from './HeaderTitle';
import { formatCurrency } from '../../utils/formatCurrency';

interface BlanketOrderAttachmentProperties {
    totalBudget: number;
    selectedBlanketOrderId: string | null;
    onChange: (id: string | null) => void;
}

export function BlanketOrderAttachment({ totalBudget, selectedBlanketOrderId, onChange }: BlanketOrderAttachmentProperties) {
    const { orders, isLoading } = useApprovedBlanketOrders(totalBudget);

    const blanketOrderIds = orders.map(o => o.id).join(',');
    useEffect(() => {
        if (orders.length > 0) {
            onChange(orders[0].id);
        } else {
            onChange(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blanketOrderIds]);

    const selectedOrder = orders.find(o => o.id === selectedBlanketOrderId) ?? null;

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-sm text-secondary-text">Loading blanket orders...</p>;
        }

        if (selectedBlanketOrderId && selectedOrder) {
            return (
                <>
                    <p className="text-xs text-secondary-text">
                        The following blanket order has been added automatically. If you don&apos;t want this quotation linked to it, please remove
                        the order.
                    </p>
                    <div className="flex items-center justify-between rounded border border-border-gray-600 bg-gray-50 px-3 py-2 text-sm">
                        <span className="flex items-center gap-1 text-primary-text">
                            {selectedOrder.id}&nbsp;—&nbsp;
                            <CurrencySymbol className="text-sm" />
                            {formatCurrency(selectedOrder.rate)}
                        </span>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="ml-2 text-secondary-text hover:text-red-600 text-base leading-none"
                            aria-label="Remove blanket order"
                        >
                            ×
                        </button>
                    </div>
                    <p className="text-xs text-secondary-text flex items-center gap-0.5">
                        Remaining budget:&nbsp;
                        <CurrencySymbol className="text-xs" />
                        {formatCurrency(selectedOrder.rate - totalBudget)}
                    </p>
                </>
            );
        }

        if (orders.length > 0) {
            return (
                <button type="button" onClick={() => onChange(orders[0].id)} className="text-sm text-brand-primary-500 underline text-left w-fit">
                    Attach blanket order
                </button>
            );
        }

        return <p className="text-sm text-red-600">No approved blanket orders with sufficient budget available.</p>;
    };

    return (
        <div className="flex flex-col gap-1">
            <HeaderTitle text="Blanket Order" size="sm" weight="medium" />
            {renderContent()}
        </div>
    );
}
