import type { ReactNode } from 'react';

export interface AdsCampaignMetricCard {
    label: string;
    value: number;
    changePercentage: number;
    changeType: '' | 'increase' | 'decrease';
    suffix?: string;
    currency?: string;
}

export interface SummaryCardProperties {
    icon: ReactNode;
    value: ReactNode;
    label: string;
    changePercentage?: number;
    changeType?: 'increase' | 'decrease';
}

export interface AdsCampaign {
    order_id?: number;
    creatives_id?: string;
    campaign_name?: string;
    category?: string;
    objective?: string;
    sponsorship_period?: string;
    cpc_cpm_rates?: string;
    total_budget?: string;
    total_amount?: number;
    submitted_on?: string;
    start_date?: string;
    clicks?: number;
    impressions?: number;
    days_remaining?: string;
    status?: string;
    // Creative Performance Metrics fields
    thumbnail_url?: string;
    asset_type?: string;
    ctr?: number;
    days_active?: string;
    // UTM Tracker fields
    utm_link?: string;
    callback_confirmed?: number;
    cvr?: number;
    link_status?: 'live' | 'callback_pending' | 'broken';
}
