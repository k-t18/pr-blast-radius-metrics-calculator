import { useState } from 'react';
import type { PaymentCategory, PaymentRecord } from '../interfaces/payments/payments.types';
import type { SelectionChangeEvent } from '../interfaces/common/table.types';
import { PAYMENT_TABS } from '../data/payments/paymentsTableData';

/**
 * Custom hook for managing payments table state and handlers.
 *
 * @returns An object containing state values and handler functions for the payments table.
 */
export function usePaymentsTable(onMakePayment?: (selectedPayments: PaymentRecord[]) => void) {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<PaymentCategory>(PAYMENT_TABS[0].value as PaymentCategory);
    const [selectedPayments, setSelectedPayments] = useState<PaymentRecord[]>([]);

    const handleTabChange = (index: number) => {
        setActiveTabIndex(index);
        setActiveTab(PAYMENT_TABS[index].value);
    };

    const handleSelectionChange = (event: SelectionChangeEvent<PaymentRecord>) => {
        const value = event.value as PaymentRecord | PaymentRecord[] | null;
        if (Array.isArray(value)) {
            setSelectedPayments(value);
        } else if (value) {
            setSelectedPayments([value]);
        } else {
            setSelectedPayments([]);
        }
    };

    const handleMakePayment = () => {
        if (onMakePayment && selectedPayments.length > 0) {
            const sortedPayments = [...selectedPayments].sort((a, b) => Number(a.amount) - Number(b.amount));

            onMakePayment(sortedPayments);
        }
    };

    return {
        activeTab,
        activeTabIndex,
        selectedPayments,
        handleTabChange,
        handleSelectionChange,
        handleMakePayment,
    };
}
