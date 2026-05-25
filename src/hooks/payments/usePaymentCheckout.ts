import { useState } from 'react';
import type { PaymentRecord } from '../../interfaces/payments/payments.types';

/**
 * Custom hook for managing payment checkout modal state and handlers
 *
 * @returns An object containing checkout modal state and handler functions
 */
export function usePaymentCheckout() {
    const [isCheckoutVisible, setCheckoutVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<PaymentRecord | null>(null);
    const [selectedPayments, setSelectedPayments] = useState<PaymentRecord[]>([]);
    const [payOutstanding, setPayOutstanding] = useState(false);

    const openCheckout = () => setCheckoutVisible(true);

    const closeCheckout = () => {
        setCheckoutVisible(false);
        setSelectedTransaction(null);
        setSelectedPayments([]);
        setPayOutstanding(false);
    };

    const handlePayOutstanding = () => {
        setPayOutstanding(true);
        setSelectedTransaction(null);
        setSelectedPayments([]);
        openCheckout();
    };

    const handlePayCustom = () => {
        setPayOutstanding(false);
        setSelectedTransaction(null);
        setSelectedPayments([]);
        openCheckout();
    };

    const handleMakePaymentFromRow = (payment: PaymentRecord) => {
        setSelectedTransaction(payment);
        setSelectedPayments([]); // Clear multiple selections when single is selected
        setPayOutstanding(false);
        openCheckout();
    };

    const handleMakePaymentFromSelection = (payments: PaymentRecord[]) => {
        // only for single selection from table
        if (payments.length === 1) {
            handleMakePaymentFromRow(payments[0]);
            return;
        }
        // only for multiple selections from table
        if (payments.length > 1) {
            setSelectedPayments(payments);
            setSelectedTransaction(null); // Clear single transaction when multiple are selected
            setPayOutstanding(false);
            openCheckout();
        }
    };

    return {
        isCheckoutVisible,
        selectedTransaction,
        selectedPayments,
        payOutstanding,
        closeCheckout,
        handlePayOutstanding,
        handlePayCustom,
        handleMakePaymentFromSelection,
        handleMakePaymentFromRow,
    };
}
