import type { PaymentCategory } from '../../interfaces/payments/payments.types';

export const PAYMENT_TABS: { label: string; value: PaymentCategory }[] = [
    { label: 'Unpaid', value: 'unpaid' },
    { label: 'Paid', value: 'paid' },
];
