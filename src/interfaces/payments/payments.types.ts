import type { ReactNode } from 'react';

export type PaymentCategory = 'unpaid' | 'paid';

export interface PaymentRecord {
    id?: string;
    invoice_id?: string;
    prize_agreement?: 'Yes' | 'No' | string;
    sponsorship_type?: string | null;
    amount?: number;
    outstanding_amount?: number;
    outstanding?: number;
    amountToBePaid?: number;
    payment_mode?: string;
    payment_status?: string;
    payment_date?: string;
    due_on?: string;
    age_days?: number;
    category?: PaymentCategory;
    receipt?: string;
}

export interface OutstandingAmountSummary {
    totalOutstanding: number;
    totalPaid: number;
    unpaid: number;
    overdue: number;
    nextPaymentIn: string;
}

export interface PaymentCardContainerProperties {
    summary: OutstandingAmountSummary;
}

export interface SummaryCardProperties {
    icon: ReactNode;
    value: ReactNode;
    label: string;
    isLoading?: boolean;
    error?: Error | unknown;
}

export interface CheckoutModalProperties {
    visible: boolean;
    onHide: () => void;
    selectedTransaction?: PaymentRecord | null;
    selectedPayments?: PaymentRecord[];
    totalOutstanding: number;
    payOutstanding?: boolean; // Flag to indicate if opened from "Pay Outstanding Amount" button
    customer?: string; // Customer ID for payment processing
    email?: string; // Customer email for payment processing
}
