export type TransactionCategory = 'mobile-game' | 'studio-show';

export interface TransactionTab {
    label: string;
    value: TransactionCategory;
}

export const TRANSACTION_TABS: TransactionTab[] = [
    { label: 'Mobile Game', value: 'mobile-game' },
    { label: 'Studio Show', value: 'studio-show' },
];
