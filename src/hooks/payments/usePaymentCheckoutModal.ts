import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useApiMutation } from '../useApiMutation';
import { paystackSinglePayment } from '../../services/payments/paystackSinglePayment.api';
import { paystackMultiPayment } from '../../services/payments/paystackMultiPayment.api';
import { paystackOutstandingPayment } from '../../services/payments/paystackOutStandingPayment.api';
import { palmPaySinglePayment } from '../../services/payments/palmPaySinglePayment.api';
import { palmPayMultiPayment } from '../../services/payments/palmPayMultiPayment.api';
import { palmPayOutstandingPayment } from '../../services/payments/palmPayOutStandingPayment.api';
import type { PaystackSinglePaymentParameters } from '../../services/payments/paystackSinglePayment.api';
import type { PaystackMultiPaymentParameters } from '../../services/payments/paystackMultiPayment.api';
import type { PaystackOutstandingPaymentParameters } from '../../services/payments/paystackOutStandingPayment.api';
import type { PalmPaySinglePaymentParameters } from '../../services/payments/palmPaySinglePayment.api';
import type { PalmPayMultiPaymentParameters } from '../../services/payments/palmPayMultiPayment.api';
import type { PalmPayOutstandingPaymentParameters } from '../../services/payments/palmPayOutStandingPayment.api';
import type { PaymentRecord } from '../../interfaces/payments/payments.types';
import type { DropdownOption } from '../../components/common/Dropdown';
import { getDoctypeFromPayment, parseCustomAmount } from '../../utils/paymentUtils';
import { showErrorToast } from '../../services/toast/toastService';

export interface PaymentCheckoutFormData {
    customAmount: string;
    paymentGateway: 'palmpay' | 'paystack';
    paymentMethod: 'card' | 'bank';
    cardType?: DropdownOption;
    bankType?: DropdownOption;
    cardHolderName: string;
    cardNumber: string;
    expiryDate: string;
    securityCode: string;
    email: string;
    phoneNumber: string;
}

interface UsePaymentCheckoutModalParameters {
    visible: boolean;
    selectedTransaction?: PaymentRecord | null;
    selectedPayments?: PaymentRecord[];
    totalOutstanding: number;
    payOutstanding?: boolean;
    customer?: string;
    email?: string;
}

/**
 * Custom hook for managing payment checkout modal logic
 *
 * @param parameters - Parameters for the checkout modal
 * @returns An object containing form, state, calculations, mutations, and handlers
 */
export function usePaymentCheckoutModal({
    visible,
    selectedTransaction,
    selectedPayments = [],
    totalOutstanding,
    payOutstanding = false,
    customer = '',
    email = '',
}: UsePaymentCheckoutModalParameters) {
    const [paymentAmount, setPaymentAmount] = useState<'outstanding-amount' | 'custom-amount' | 'transaction'>('transaction');
    const [gateway, setGateway] = useState<'palmpay' | 'paystack'>('palmpay');
    const [isRedirecting, setIsRedirecting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<PaymentCheckoutFormData>({
        defaultValues: {
            customAmount: '',
            paymentGateway: 'palmpay',
            paymentMethod: 'card',
            cardType: undefined,
            bankType: undefined,
            cardHolderName: '',
            cardNumber: '',
            expiryDate: '',
            securityCode: '',
            email: '',
            phoneNumber: '',
        },
    });

    const customAmountValue = watch('customAmount');
    const productType = 'bank_transfer';

    // Reset form when modal closes or opens
    useEffect(() => {
        if (!visible) {
            // Reset form when modal closes
            reset({
                customAmount: '',
                paymentGateway: 'palmpay',
                paymentMethod: 'card',
                cardType: undefined,
                bankType: undefined,
                cardHolderName: '',
                cardNumber: '',
                expiryDate: '',
                securityCode: '',
                email: '',
                phoneNumber: '',
            });
            // Reset state
            setPaymentAmount('transaction');
            setGateway('palmpay');
            setIsRedirecting(false);
        }
    }, [visible, reset]);

    // Set payment amount based on how modal was opened
    useEffect(() => {
        if (!visible) return; // Don't run when modal is closed

        if (payOutstanding) {
            // When opened from "Pay Outstanding Amount", set to outstanding-amount
            setPaymentAmount('outstanding-amount');
        } else if (!selectedTransaction && selectedPayments.length === 0 && !payOutstanding) {
            // When opened from "Pay Custom Amount" (no transactions selected), set to custom-amount
            setPaymentAmount('custom-amount');
        } else if (selectedTransaction || selectedPayments.length > 0) {
            // When transactions are selected, set to transaction
            setPaymentAmount('transaction');
        }
    }, [visible, payOutstanding, selectedTransaction, selectedPayments]);

    // Get all transactions to allocate custom amount
    const allTransactions = useMemo(() => {
        if (selectedPayments.length > 0) {
            return selectedPayments;
        }
        if (selectedTransaction) {
            return [selectedTransaction];
        }
        return [];
    }, [selectedPayments, selectedTransaction]);

    // Calculate payment details with custom amount allocation
    const paymentDetailsFromSelection = useMemo(() => {
        // When paying outstanding amount, don't show individual transaction IDs
        if (paymentAmount === 'outstanding-amount') {
            return [];
        }

        // If custom amount is selected and has a value, allocate it (only for selected transactions, not outstanding)
        if (paymentAmount === 'custom-amount' && customAmountValue && !payOutstanding) {
            const customAmount = parseCustomAmount(customAmountValue);
            if (customAmount > 0 && allTransactions.length > 0) {
                let remainingAmount = customAmount;
                const allocatedPayments: Array<{ id: string; status: string; amount: number }> = [];

                allTransactions.forEach(transaction => {
                    const transactionAmount = transaction.amount || 0;

                    if (remainingAmount <= 0) {
                        // No remaining amount, show original amount and mark as Not Settled
                        allocatedPayments.push({
                            id: transaction.invoice_id || '',
                            status: 'Not Settled',
                            amount: transactionAmount,
                        });
                    } else if (remainingAmount >= transactionAmount) {
                        // Fully settled
                        allocatedPayments.push({
                            id: transaction.invoice_id || '',
                            status: 'Fully Settled',
                            amount: transactionAmount,
                        });
                        remainingAmount -= transactionAmount;
                    } else {
                        // Partially settled with allocated amount
                        allocatedPayments.push({
                            id: transaction.invoice_id || '',
                            status: 'Partially Settled',
                            amount: remainingAmount,
                        });
                        remainingAmount = 0;
                    }
                });

                return allocatedPayments;
            }
        }

        // Default: show all selected transactions as fully settled
        if (selectedPayments.length > 0) {
            return selectedPayments.map(payment => ({
                id: payment.invoice_id || '',
                status: 'Fully Settled',
                amount: payment.amount || 0,
            }));
        }
        if (selectedTransaction) {
            return [
                {
                    id: selectedTransaction.invoice_id || '',
                    status: 'Fully Settled',
                    amount: selectedTransaction.amount || 0,
                },
            ];
        }
        // Return empty array when no specific transactions are selected (for custom amount from outstanding)
        if (!selectedTransaction && selectedPayments.length === 0 && paymentAmount === 'custom-amount') {
            return [];
        }
        return [];
    }, [selectedPayments, selectedTransaction, paymentAmount, customAmountValue, allTransactions, payOutstanding]);

    // Calculate subtotal - only include fully settled amounts
    const subtotal = useMemo(() => {
        if (paymentAmount === 'outstanding-amount') {
            return totalOutstanding;
        }
        // For custom amount, always use the custom amount value (regardless of selected transactions)
        if (paymentAmount === 'custom-amount' && customAmountValue) {
            return parseCustomAmount(customAmountValue);
        }
        // For selected transactions without custom amount, calculate from payment details
        return paymentDetailsFromSelection.filter(item => item.status === 'Fully Settled').reduce((total, item) => total + item.amount, 0);
    }, [paymentAmount, paymentDetailsFromSelection, totalOutstanding, customAmountValue]);

    const pspFee = 0;
    const total = useMemo(() => {
        if (paymentAmount === 'outstanding-amount') {
            return totalOutstanding + pspFee;
        }
        if (paymentAmount === 'custom-amount' && customAmountValue) {
            const customAmount = parseCustomAmount(customAmountValue);
            return customAmount + pspFee;
        }
        return subtotal + pspFee;
    }, [paymentAmount, customAmountValue, subtotal, pspFee, totalOutstanding]);

    // Calculate total amount from selected payments or single transaction
    const selectedTransactionsTotal = useMemo(() => {
        if (selectedPayments.length > 0) {
            return selectedPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
        }
        return selectedTransaction?.amount || 0;
    }, [selectedPayments, selectedTransaction]);

    // Paystack Single Payment Mutation
    const paystackSingleMutation = useApiMutation({
        mutationFn: (parameters: PaystackSinglePaymentParameters) => paystackSinglePayment(parameters),
        onSuccess: response => {
            if (response.message?.data?.authorization_url) {
                setIsRedirecting(true);
                window.open(response.message.data.authorization_url, '_self');
            } else {
                showErrorToast('Failed to initialize payment. Please try again.');
            }
        },
        onError: () => {
            /* eslint-disable no-console */
            console.error('An error occurred while processing your payment. Please try again.');
        },
        successMessage: 'Payment initiated successfully.',
        showErrorToast: true,
    });

    // Paystack Multi Payment Mutation
    const paystackMultiMutation = useApiMutation({
        mutationFn: (parameters: PaystackMultiPaymentParameters) => paystackMultiPayment(parameters),
        onSuccess: response => {
            if (response.message?.data?.authorization_url) {
                setIsRedirecting(true);
                window.open(response.message.data.authorization_url, '_self');
            } else {
                showErrorToast('Failed to initialize payment. Please try again.');
            }
        },
        onError: () => {
            /* eslint-disable no-console */
            console.error('An error occurred while processing your payment. Please try again.');
        },
        successMessage: 'Payment initiated successfully.',
        showErrorToast: false,
    });

    // Paystack Outstanding Payment Mutation
    const paystackOutstandingMutation = useApiMutation({
        mutationFn: (parameters: PaystackOutstandingPaymentParameters) => paystackOutstandingPayment(parameters),
        onSuccess: response => {
            if (response.message?.data?.authorization_url) {
                setIsRedirecting(true);
                window.open(response.message.data.authorization_url, '_self');
            } else {
                showErrorToast('Failed to initialize payment. Please try again.');
            }
        },
        onError: () => {
            /* eslint-disable no-console */
            console.error('An error occurred while processing your payment. Please try again.');
        },
        successMessage: 'Payment initiated successfully.',
        showErrorToast: false,
    });

    // PalmPay Single Payment Mutation
    const palmPaySingleMutation = useApiMutation({
        mutationFn: (parameters: PalmPaySinglePaymentParameters) => palmPaySinglePayment(parameters),
        onSuccess: response => {
            if (response.message?.data?.mockCheckoutUrl) {
                setIsRedirecting(true);
                window.open(response.message.data.mockCheckoutUrl, '_self');
            } else {
                showErrorToast('Failed to initialize payment. Please try again.');
            }
        },
        onError: () => {
            /* eslint-disable no-console */
            console.error('An error occurred while processing your payment. Please try again.');
        },
        successMessage: 'Payment initiated successfully.',
        showErrorToast: false,
    });

    // PalmPay Multi Payment Mutation
    const palmPayMultiMutation = useApiMutation({
        mutationFn: (parameters: PalmPayMultiPaymentParameters) => palmPayMultiPayment(parameters),
        onSuccess: response => {
            if (response.message?.data?.mockCheckoutUrl) {
                setIsRedirecting(true);
                window.open(response.message.data.mockCheckoutUrl, '_self');
            } else {
                showErrorToast('Failed to initialize payment. Please try again.');
            }
        },
        onError: () => {
            /* eslint-disable no-console */
            console.error('An error occurred while processing your payment. Please try again.');
        },
        successMessage: 'Payment initiated successfully.',
        showErrorToast: false,
    });

    // PalmPay Outstanding Payment Mutation
    const palmPayOutstandingMutation = useApiMutation({
        mutationFn: (parameters: PalmPayOutstandingPaymentParameters) => palmPayOutstandingPayment(parameters),
        onSuccess: response => {
            if (response.message?.data?.mockCheckoutUrl) {
                setIsRedirecting(true);
                window.open(response.message.data.mockCheckoutUrl, '_self');
            } else {
                showErrorToast('Failed to initialize payment. Please try again.');
            }
        },
        onError: () => {
            /* eslint-disable no-console */
            console.error('An error occurred while processing your payment. Please try again.');
        },
        successMessage: 'Payment initiated successfully.',
        showErrorToast: false,
    });

    const isSubmitting =
        paystackSingleMutation.isPending ||
        paystackMultiMutation.isPending ||
        paystackOutstandingMutation.isPending ||
        palmPaySingleMutation.isPending ||
        palmPayMultiMutation.isPending ||
        palmPayOutstandingMutation.isPending ||
        isRedirecting;

    // Update form when payment gateway changes
    const handleGatewayChange = (newGateway: 'palmpay' | 'paystack') => {
        setGateway(newGateway);
        setValue('paymentGateway', newGateway);
    };

    const onSubmit = async (data: PaymentCheckoutFormData) => {
        // Use email from form or fallback to prop
        const customerEmail = data.email || email;

        if (!customerEmail || !customer) {
            showErrorToast('Customer email and customer ID are required');
            return;
        }

        // Handle Paystack single payment (when single transaction is selected)
        if (gateway === 'paystack' && selectedTransaction && selectedPayments.length === 0 && !payOutstanding) {
            // Use custom amount if entered, otherwise use transaction amount
            const amountToPay =
                paymentAmount === 'custom-amount' && customAmountValue ? parseCustomAmount(customAmountValue) : selectedTransaction.amount || 0;

            if (amountToPay <= 0) {
                showErrorToast('Please enter a valid amount.');
                return;
            }

            // Determine doctype from payment record
            const doctype = getDoctypeFromPayment(selectedTransaction);

            // Call Paystack single payment mutation
            paystackSingleMutation.mutate({
                email: customerEmail,
                amount: amountToPay,
                customer,
                doctype,
                docname: selectedTransaction.invoice_id || '',
            });
        }
        // Handle PalmPay single payment (when single transaction is selected)
        else if (gateway === 'palmpay' && selectedTransaction && selectedPayments.length === 0 && !payOutstanding) {
            const amountToPay =
                paymentAmount === 'custom-amount' && customAmountValue ? parseCustomAmount(customAmountValue) : selectedTransaction.amount || 0;

            if (amountToPay <= 0) {
                showErrorToast('Please enter a valid amount.');
                return;
            }

            const doctype = getDoctypeFromPayment(selectedTransaction);

            // Call PalmPay single payment mutation
            palmPaySingleMutation.mutate({
                doctype,
                docname: selectedTransaction.invoice_id || '',
                productType,
                customer,
                amount: amountToPay,
            });
        }
        // Handle Paystack multi-payment (when multiple transactions are selected)
        else if (gateway === 'paystack' && selectedPayments.length > 0 && !payOutstanding) {
            // Build documents array from payment details (this handles custom amount allocation)
            // Filter out items with status "Not Settled" - they shouldn't be included in the payment
            const documents = paymentDetailsFromSelection
                .filter(detail => detail.status !== 'Not Settled')
                .map(detail => {
                    // Find the original payment record to get prize_agreement
                    const originalPayment = selectedPayments.find(p => p.invoice_id === detail.id) || selectedTransaction || undefined;
                    return {
                        doctype: getDoctypeFromPayment(originalPayment),
                        docname: detail.id,
                        amount: detail.amount,
                    };
                });

            // Calculate total amount to pay
            const totalAmountToPay = total; // This already includes custom amount allocation if applicable

            if (documents.length === 0) {
                showErrorToast('No documents to process. Please select transactions.');
                return;
            }

            // Call Paystack multi-payment mutation
            paystackMultiMutation.mutate({
                email: customerEmail,
                amount: totalAmountToPay,
                customer,
                documents,
            });
        }
        // Handle PalmPay multi-payment (when multiple transactions are selected)
        else if (gateway === 'palmpay' && selectedPayments.length > 0 && !payOutstanding) {
            // Filter out items with status "Not Settled" - they shouldn't be included in the payment
            const documents = paymentDetailsFromSelection
                .filter(detail => detail.status !== 'Not Settled')
                .map(detail => {
                    const originalPayment = selectedPayments.find(p => p.invoice_id === detail.id) || selectedTransaction || undefined;
                    return {
                        doctype: getDoctypeFromPayment(originalPayment),
                        docname: detail.id,
                        amount: detail.amount,
                    };
                });

            const totalAmountToPay = total;

            if (documents.length === 0) {
                showErrorToast('No documents to process. Please select transactions.');
                return;
            }

            // Call PalmPay multi-payment mutation
            palmPayMultiMutation.mutate({
                customer,
                amount: totalAmountToPay,
                productType,
                documents,
            });
        }
        // Handle Paystack outstanding payment (when "Pay Outstanding Amount" is clicked)
        else if (gateway === 'paystack' && payOutstanding && paymentAmount === 'outstanding-amount') {
            // Use total outstanding amount
            const amountToPay = totalOutstanding;

            if (amountToPay <= 0) {
                showErrorToast('No outstanding amount to pay.');
                return;
            }

            // Call Paystack outstanding payment mutation
            paystackOutstandingMutation.mutate({
                email: customerEmail,
                amount: amountToPay,
                customer,
            });
        }
        // Handle PalmPay outstanding payment (when "Pay Outstanding Amount" is clicked)
        else if (gateway === 'palmpay' && payOutstanding && paymentAmount === 'outstanding-amount') {
            const amountToPay = totalOutstanding;

            if (amountToPay <= 0) {
                showErrorToast('No outstanding amount to pay.');
                return;
            }

            // Call PalmPay outstanding payment mutation
            palmPayOutstandingMutation.mutate({
                customer,
                amount: amountToPay,
                productType,
            });
        }
        // Handle Paystack custom amount for outstanding payment (when "Pay Custom Amount" is clicked)
        else if (gateway === 'paystack' && paymentAmount === 'custom-amount' && customAmountValue) {
            // Use custom amount value
            const amountToPay = parseCustomAmount(customAmountValue);

            if (amountToPay <= 0) {
                showErrorToast('Please enter a valid amount.');
                return;
            }

            // Call Paystack outstanding payment mutation with custom amount
            paystackOutstandingMutation.mutate({
                email: customerEmail,
                amount: amountToPay,
                customer,
            });
        }
        // Handle PalmPay custom amount (including outstanding custom)
        else if (gateway === 'palmpay' && paymentAmount === 'custom-amount' && customAmountValue) {
            const amountToPay = parseCustomAmount(customAmountValue);

            if (amountToPay <= 0) {
                showErrorToast('Please enter a valid amount.');
                return;
            }

            // Call PalmPay outstanding payment mutation with custom amount
            palmPayOutstandingMutation.mutate({
                customer,
                amount: amountToPay,
                productType,
            });
        }
    };

    return {
        // Form
        control,
        handleSubmit,
        errors,
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
    };
}
