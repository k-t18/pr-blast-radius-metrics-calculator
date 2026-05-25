import { useMemo } from 'react';
import type { PaymentRecord } from '../../../interfaces/payments/payments.types';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import ActionButton from '../../../components/common/ActionButton';
import FloatingContainer from '../../../components/common/FloatingContainer';

interface PaymentSelectionSummaryProperties {
    selectedPayments: PaymentRecord[];
    handleMakePayment: () => void;
}

export function PaymentSelectionSummary({ selectedPayments, handleMakePayment }: PaymentSelectionSummaryProperties) {
    const totalAmount = useMemo(() => {
        return selectedPayments.reduce((sum, payment) => {
            return sum + (payment.amount ?? 0);
        }, 0);
    }, [selectedPayments]);

    if (selectedPayments.length === 0) {
        return;
    }

    return (
        <FloatingContainer
            position="sticky"
            bottom="10rem"
            left="-0.5rem"
            width="calc(100% + 1rem)"
            bgColor="white"
            borderRadius="0.5rem"
            padding="1rem 0.5rem 1rem 1rem"
            className="-mx-2 flex items-center justify-between mt-4"
        >
            {/* Left */}
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium leading-[22px]">Rows Selected ({selectedPayments.length})</span>
            </div>

            {/* Right */}
            <ActionButton borderRadius="rounded" width="auto" className="text-sm font-medium leading-5 font-ubuntu" onClick={handleMakePayment}>
                <span className="flex items-center gap-1">
                    Make Payment:
                    <CurrencySymbol />
                    <CurrencyAmount value={totalAmount} />
                </span>
            </ActionButton>
        </FloatingContainer>
    );
}
