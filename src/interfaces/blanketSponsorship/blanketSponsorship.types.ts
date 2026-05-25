import type { ReactNode } from 'react';

export interface DurationDropdownProperties {
    label: ReactNode;
    value: string;
    onChange: (value: string) => void;
}

export interface BudgetInputProperties {
    id: string;
    label: ReactNode;
    value: string;
    onChange: (value: string) => void;
}

export interface BlanketOrderSubmissionModalProperties {
    visible: boolean;
    onHide: () => void;
    onViewSubmittedOrder: () => void;
    onSubmitNewOrder: () => void;
}

export type BlanketOrderStatus = 'approved' | 'pending_review' | 'rejected';

export interface BlanketOrderRecord {
    id: string;
    created_on: string;
    rate: number;
    start_date: string;
    duration: number;
    status: BlanketOrderStatus;
    remarks?: string;
}

export type SponsorshipType = '' | 'Studio Show' | 'Mobile Game' | 'Both';
export type AllocationPreference = '' | 'By Chances Team' | 'By Sponsor';

export interface BlanketSponsorshipFormData {
    sponsorship_type: SponsorshipType;
    studio_show_rate?: string;
    studio_start_date?: string;
    studio_show_sponsor_ship_duration?: string;
    mobile_show_rate?: string;
    mobile_start_date?: string;
    mobile_show_sponsor_ship_duration?: string;
    allocation_type?: AllocationPreference;
    remarks?: string;
}
