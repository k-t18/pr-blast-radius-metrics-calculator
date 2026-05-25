/* eslint-disable unicorn/filename-case */
import type { MultiSelectOption } from '../../../../../components/form-fields/multiSelect/MultiSelect';

export interface NGOWithAllocation extends MultiSelectOption {
    csr_amount?: number;
    percentage_allocated?: number;
}

export interface CSRFormData {
    contributeOnTotalOrder: string; // 'yes' | 'no'
    contributionType: string; // 'amount' | 'percentage'
    contributionValue: number;
    selectedNGOs: NGOWithAllocation[];
    allowChancesToSelect: boolean;
    splitMethod: string; // 'equally' | 'amount' | 'percentage'
    ngoAmounts: Record<string, number>; // NGO value -> amount
    ngoPercentages: Record<string, number>; // NGO value -> percentage
}

export interface SavedCSRData {
    ngo_name: string;
    csr_amount: number;
    percentage_allocated: number;
    disbursement_ownership: string;
    item?: string;
    split_method?: 'equally' | 'amount' | 'percentage';
}
