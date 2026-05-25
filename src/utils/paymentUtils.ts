import type { PaymentRecord } from '../interfaces/payments/payments.types';

// Helper function to parse custom amount value (handles formatted currency with commas)
export const parseCustomAmount = (value: string | undefined): number => {
    if (!value) return 0;
    // Remove all commas and parse as float
    return Number.parseFloat(value.replaceAll(',', '')) || 0;
};

// Helper function to determine doctype from payment record
export const getDoctypeFromPayment = (payment?: PaymentRecord): string => {
    if (!payment) return 'Sales Invoice';

    // Use prize_agreement field from payment record
    if (payment.prize_agreement === 'Yes') {
        return 'Prize Agreement';
    }

    // Default to Sales Invoice if prize_agreement is "No" or not set
    return 'Sales Invoice';
};
