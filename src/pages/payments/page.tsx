import { lazy, Suspense, useState } from 'react';
import { SettleOutstandingAmount } from './components/SettleOutstandingAmount';
import { PaymentCardContainer } from './components/PaymentCardContainer';
import { PaymentsTable } from './components/PaymentsTable';
import HeaderTitle from '../../components/common/HeaderTitle';
import type { PaymentCategory } from '../../interfaces/payments/payments.types';
import { useTotalOutstanding } from '../../hooks/payments/useTotalOutstanding';
import { usePaymentCheckout } from '../../hooks/payments/usePaymentCheckout';

const AvailableCredit = lazy(() => import('./components/AvailableCredit'));
const PaymentCheckoutModal = lazy(() => import('./components/PaymentCheckoutModal'));

function PaymentsPage() {
    const [activePaymentTab, setActivePaymentTab] = useState<PaymentCategory>('unpaid');

    // Fetch total outstanding amount from API (shared between components)
    const { totalOutstanding, customer, email, isLoading: isTotalOutstandingLoading, error: totalOutstandingError } = useTotalOutstanding();

    // Manage checkout modal state and handlers
    const {
        isCheckoutVisible,
        selectedTransaction,
        selectedPayments,
        payOutstanding,
        closeCheckout,
        handlePayOutstanding,
        handleMakePaymentFromSelection,
        handleMakePaymentFromRow,
    } = usePaymentCheckout();

    return (
        <div>
            <HeaderTitle text="Payments" size="2xl" weight="medium" disabled={false} className="mb-6" />
            {activePaymentTab === 'unpaid' && (
                <Suspense fallback={undefined}>
                    <AvailableCredit />
                </Suspense>
            )}
            <SettleOutstandingAmount
                onPayOutstanding={handlePayOutstanding}
                totalOutstanding={totalOutstanding}
                isLoading={isTotalOutstandingLoading}
                error={totalOutstandingError}
            />
            <PaymentCardContainer />
            <PaymentsTable
                onMakePayment={handleMakePaymentFromSelection}
                onMakePaymentFromRow={handleMakePaymentFromRow}
                onTabChange={setActivePaymentTab}
            />
            <Suspense fallback={undefined}>
                <PaymentCheckoutModal
                    visible={isCheckoutVisible}
                    onHide={closeCheckout}
                    selectedTransaction={selectedTransaction}
                    selectedPayments={selectedPayments}
                    totalOutstanding={totalOutstanding}
                    payOutstanding={payOutstanding}
                    customer={customer}
                    email={email}
                />
            </Suspense>
        </div>
    );
}

export default PaymentsPage;
