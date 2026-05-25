import type { CheckoutModalProperties } from '../../../interfaces/payments/payments.types';
import ModalWrapper from '../../../components/common/ModalWrapper';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import { Info, PalmpayLogo, PaystackLogo } from '../../../components/icons';
import { PaymentAmountOption } from './PaymentAmountOption';
import { PaymentMethodOption } from './PaymentMethodOption';
import PaymentDetailsSummary from './PaymentDetailsSummary';
import { usePaymentCheckoutModal } from '../../../hooks/payments/usePaymentCheckoutModal';

export default function PaymentCheckoutModal({
    visible,
    onHide,
    selectedTransaction,
    selectedPayments = [],
    totalOutstanding,
    payOutstanding = false,
    customer = '',
    email = '',
}: CheckoutModalProperties) {
    const {
        // Form
        handleSubmit,
        setValue,
        customAmountValue,
        // State
        paymentAmount,
        setPaymentAmount,
        gateway,
        handleGatewayChange,
        // Calculations
        paymentDetailsFromSelection,
        subtotal,
        total,
        selectedTransactionsTotal,
        pspFee,
        // Submission
        isSubmitting,
        onSubmit,
    } = usePaymentCheckoutModal({
        visible,
        selectedTransaction,
        selectedPayments,
        totalOutstanding,
        payOutstanding,
        customer,
        email,
    });

    // Calculate info message for custom amount
    const getCustomAmountInfoMessage = (): string => {
        if (paymentAmount !== 'custom-amount' || !customAmountValue) {
            return '';
        }

        const fullySettledCount = paymentDetailsFromSelection.filter(p => p.status === 'Fully Settled').length;
        const hasPartiallySettled = paymentDetailsFromSelection.some(p => p.status === 'Partially Settled');

        if (fullySettledCount > 0 && hasPartiallySettled) {
            return `Will settle ${fullySettledCount} transaction${fullySettledCount > 1 ? 's' : ''} fully and 1 partially.`;
        }

        if (fullySettledCount > 0) {
            return `Will settle ${fullySettledCount} transaction${fullySettledCount > 1 ? 's' : ''} fully.`;
        }

        return 'Allocating custom amount to transactions.';
    };

    // Calculate info message for selected transactions
    const getSelectedTransactionsInfoMessage = (): string => {
        if (!selectedTransaction && selectedPayments.length === 0) {
            return '';
        }

        if (selectedPayments.length > 0) {
            return `Will settle ${selectedPayments.length} transaction${selectedPayments.length > 1 ? 's' : ''} fully.`;
        }

        return `Will settle transaction ${selectedTransaction?.invoice_id} fully.`;
    };

    const customAmountInfoMessage = getCustomAmountInfoMessage();
    const selectedTransactionsInfoMessage = getSelectedTransactionsInfoMessage();

    // Get the appropriate info message component based on payment amount
    const getInfoMessageComponent = () => {
        if (paymentAmount === 'outstanding-amount') {
            return (
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <Info size={13} color="text-gray-800" />{' '}
                    <span className="text-xs font-normal leading-5 text-gray-800">Will settle all outstanding transactions.</span>
                </p>
            );
        }

        if (paymentAmount === 'custom-amount' && customAmountValue && customAmountInfoMessage) {
            return (
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <Info size={13} color="text-gray-800" />{' '}
                    <span className="text-xs font-normal leading-5 text-gray-800">{customAmountInfoMessage}</span>
                </p>
            );
        }

        if (selectedTransactionsInfoMessage) {
            return (
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <Info size={13} color="text-gray-800" />{' '}
                    <span className="text-xs font-normal leading-5 text-gray-800">{selectedTransactionsInfoMessage}</span>
                </p>
            );
        }

        return null;
    };

    const infoMessageComponent = getInfoMessageComponent();

    return (
        <ModalWrapper visible={visible} onHide={onHide} title="Check Out" titleSize="2xl" showCloseButton className="max-w-7xl" modalSize="xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="flex-1 space-y-6">
                        <section className="rounded-lg border border-gray-600 p-4">
                            <HeaderTitle text="1. Payment Amount" size="md" weight="medium" disabled={false} className="leading-6" />
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <PaymentAmountOption
                                    label="Total Outstanding Amount"
                                    isActive={paymentAmount === 'outstanding-amount'}
                                    onClick={() => setPaymentAmount('outstanding-amount')}
                                    childClass="mt-5 text-left"
                                >
                                    <CurrencySymbol className="font-ubuntu font-medium text-base leading-6 mr-1" />
                                    <CurrencyAmount value={totalOutstanding} className="font-ubuntu font-medium text-base leading-6" />
                                </PaymentAmountOption>

                                <PaymentAmountOption
                                    label="Selected Transactions"
                                    isActive={paymentAmount === 'transaction'}
                                    onClick={() => {
                                        setPaymentAmount('transaction');
                                        setValue('customAmount', ''); // Clear custom amount when selecting transactions
                                    }}
                                    childClass="mt-5 text-left"
                                    disabled={payOutstanding}
                                >
                                    <p>
                                        <CurrencySymbol className="font-ubuntu font-medium text-base leading-6 mr-1" />
                                        <CurrencyAmount value={selectedTransactionsTotal} className="font-ubuntu font-medium text-base leading-6" />
                                    </p>
                                </PaymentAmountOption>
                            </div>
                            {infoMessageComponent}
                        </section>
                        {/* Payment Gateway  */}
                        <section className="p-4 mt-6">
                            <HeaderTitle text="2. Choose Payment Gateway" size="md" weight="medium" className="leading-6" disabled={false} />
                            <div className="mt-4 flex gap-4">
                                <PaymentMethodOption
                                    icon={<PalmpayLogo size={24} />}
                                    isActive={gateway === 'palmpay'}
                                    onClick={() => handleGatewayChange('palmpay')}
                                />

                                <PaymentMethodOption
                                    icon={<PaystackLogo size={24} />}
                                    isActive={gateway === 'paystack'}
                                    onClick={() => handleGatewayChange('paystack')}
                                />
                            </div>
                        </section>
                        {/* Payment Method - Only show for Palmpay may use later dont delete code */}
                        {/* {gateway === 'palmpay' && (
                            <section className="p-4 mt-6">
                                <HeaderTitle text="3. Choose Payment Method" size="md" weight="medium" className="leading-6" disabled={false} />
                                <div className="mt-4 flex gap-4">
                                    <PaymentMethodOption
                                        label="Card"
                                        icon={<CreditCardIcon size={24} />}
                                        isActive={method === 'card'}
                                        onClick={() => handleMethodChange('card')}
                                    />
                                    <PaymentMethodOption
                                        label="Bank"
                                        icon={<BankIcon size={24} />}
                                        isActive={method === 'bank'}
                                        onClick={() => handleMethodChange('bank')}
                                    />
                                </div>

                                <PaymentMethodFields
                                    method={method}
                                    cardOptions={creditCardOptions}
                                    bankOptions={bankOptions}
                                    control={control}
                                    errors={errors}
                                    isCreditCardDetailsLoading={isCreditCardDetailsLoading}
                                    isBankDetailsLoading={isBankDetailsLoading}
                                />
                            </section>
                        )} */}
                    </div>
                    <PaymentDetailsSummary
                        paymentDetails={paymentDetailsFromSelection}
                        subtotal={subtotal}
                        pspFee={pspFee}
                        total={total}
                        totalPayAmount={total}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </form>
        </ModalWrapper>
    );
}

export { type PaymentCheckoutFormData } from '../../../hooks/payments/usePaymentCheckoutModal';
