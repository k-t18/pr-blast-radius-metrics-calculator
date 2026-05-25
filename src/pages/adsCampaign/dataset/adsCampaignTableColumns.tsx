import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import { HyphenatedDate } from '../../../components/common/HyphenatedDate';
import StatusBadge from '../../../components/common/StatusBadge';
import type { DataTableWrapperColumn } from '../../../interfaces/common/table.types';
import type { AdsCampaign } from '../../../interfaces/adsCampaign/adsCampaign.types';

/**
 * Formats large numbers with commas (e.g., 45000000 -> "45,000,000")
 */
function formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) return '--';
    return value.toLocaleString('en-US');
}

/**
 * Formats CTR as percentage (e.g., 3.8 -> "3.8%")
 */
function formatCTR(value: number | undefined): string {
    if (value === undefined || value === null) return '--';
    return `${value}%`;
}

/**
 * Formats CVR as percentage (e.g., 92 -> "92%")
 */
function formatCVR(value: number | undefined): string {
    if (value === undefined || value === null) return '--';
    return `${value}%`;
}

/**
 * Renders link status with colored filled circle icon
 */
function LinkStatus({ status }: { status?: string }) {
    if (!status) return <span className="text-[#101828]">--</span>;

    const getStatusConfig = () => {
        switch (status) {
            case 'live': {
                return { color: '#22c55e', label: 'Live' }; // Green
            }
            case 'callback_pending': {
                return { color: '#f97316', label: 'Callback Pending' }; // Orange
            }
            case 'broken': {
                return { color: '#ef4444', label: 'Broken' }; // Red
            }
            default: {
                return { color: '#6b7280', label: status }; // Gray
            }
        }
    };

    const { color, label } = getStatusConfig();

    return (
        <span className="flex items-center gap-2 text-[#101828]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span>{label}</span>
        </span>
    );
}

/**
 * Renders sponsorship period handling both date range and duration formats.
 * - Date range format: "2025-12-12 to 2026-02-03" -> formats both dates
 * - Duration format: "2 months" -> displays as-is
 */
function SponsorshipPeriod({ period, className }: { period: string; className?: string }) {
    if (!period) return <span className={className}>--</span>;

    // Check if it's a date range format (contains "to")
    if (period.includes(' to ')) {
        const [startDate, endDate] = period.split(' to ').map(date => date.trim());
        return (
            <span className={className}>
                <HyphenatedDate date={startDate} className={className} /> to <HyphenatedDate date={endDate} className={className} />
            </span>
        );
    }

    // Otherwise, treat as duration (e.g., "2 months", "3 weeks", etc.)
    return <span className={className}>{period}</span>;
}

export const TABS: { label: string; value: string }[] = [
    { label: 'Live', value: 'live' },
    { label: 'Submitted', value: 'submitted' },
];
export const submittedColumns: DataTableWrapperColumn<AdsCampaign>[] = [
    { field: 'campaign_name', header: 'Campaign Name', style: { minWidth: '200px' } },
    { field: 'category', header: 'Category', style: { minWidth: '150px' } },
    { field: 'objective', header: 'Objective', style: { minWidth: '150px' } },
    {
        field: 'sponsorship_period',
        header: 'Sponsorship Period',
        body: rowData => <SponsorshipPeriod period={rowData.sponsorship_period ?? ''} className="text-[#101828]" />,
        style: { minWidth: '220px' },
    },
    {
        field: 'cpc_cpm_rates',
        header: 'CPC / CPM Rates',
        style: { minWidth: '180px' },
    },
    {
        field: 'total_budget',
        header: 'Total Budget',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData.total_amount ?? 0} className="text-[#101828]" />
            </span>
        ),
        style: { minWidth: '150px' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'submitted_on',
        header: 'Submitted On',
        body: rowData => <HyphenatedDate date={rowData.submitted_on ?? ''} className="text-[#101828]" />,
        style: { minWidth: '120px' },
    },

    {
        field: 'status',
        header: 'Status',
        body: rowData => <StatusBadge statusKey={rowData.status} variant="filled" shape="square" className="text-[10px] font-normal" />,
        style: { minWidth: '120px' },
    },
];

export const liveColumns: DataTableWrapperColumn<AdsCampaign>[] = [
    { field: 'order_id', header: 'Order ID', style: { minWidth: '200px' } },
    { field: 'creatives_id', header: 'Creatives ID', style: { minWidth: '150px' } },
    { field: 'campaign_name', header: 'Campaign Name', style: { minWidth: '200px' } },
    { field: 'category', header: 'Category', style: { minWidth: '150px' } },
    { field: 'objective', header: 'Objective', style: { minWidth: '150px' } },
    {
        field: 'start_date',
        header: 'Start Date',
        body: rowData => (rowData.start_date ? <HyphenatedDate date={rowData.start_date} className="text-[#101828]" /> : '--'),
        style: { minWidth: '120px' },
    },
    { field: 'clicks', header: 'Clicks', style: { minWidth: '100px' } },
    { field: 'impressions', header: 'Impressions', style: { minWidth: '120px' } },
    { field: 'days_remaining', header: 'Days Remaining', style: { minWidth: '130px' } },
];

export const creativePerformanceColumns: DataTableWrapperColumn<AdsCampaign>[] = [
    {
        field: 'thumbnail_url',
        header: 'Thumbnail',
        body: rowData => (
            <div className="flex items-center">
                {rowData.thumbnail_url ? (
                    <img src={rowData.thumbnail_url} alt="Creative thumbnail" className="h-12 w-12 rounded object-cover" />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-400">
                        <span className="text-xs">No Image</span>
                    </div>
                )}
            </div>
        ),
        style: { width: '10%' },
    },
    {
        field: 'asset_type',
        header: 'Asset Type',
        body: rowData => <span className="text-[#101828]">{rowData.asset_type ?? '--'}</span>,
        style: { width: '10%' },
    },
    {
        field: 'category',
        header: 'Category',
        body: rowData => <span className="text-[#101828]">{rowData.category ?? '--'}</span>,
        style: { width: '12%' },
    },
    {
        field: 'impressions',
        header: 'Impressions',
        body: rowData => <span className="text-[#101828]">{formatNumber(rowData.impressions)}</span>,
        style: { width: '12%' },
    },
    {
        field: 'clicks',
        header: 'Clicks',
        body: rowData => <span className="text-[#101828]">{formatNumber(rowData.clicks)}</span>,
        style: { width: '10%' },
    },
    {
        field: 'ctr',
        header: 'CTR',
        body: rowData => <span className="text-[#101828]">{formatCTR(rowData.ctr)}</span>,
        style: { width: '8%' },
    },
    {
        field: 'days_active',
        header: 'Days Active',
        body: rowData => <span className="text-[#101828]">{rowData.days_active ?? '--'}</span>,
        style: { width: '12%' },
    },
    {
        field: 'status',
        header: 'Status',
        body: rowData => <StatusBadge statusKey={rowData.status} variant="filled" shape="square" className="text-[10px] font-normal" />,
        style: { width: '12%' },
    },
];

export const utmTrackerColumns: DataTableWrapperColumn<AdsCampaign>[] = [
    {
        field: 'thumbnail_url',
        header: 'Thumbnail',
        body: rowData => (
            <div className="flex items-center">
                {rowData.thumbnail_url ? (
                    <img src={rowData.thumbnail_url} alt="Creative thumbnail" className="h-12 w-12 rounded object-cover" />
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-400">
                        <span className="text-xs">No Image</span>
                    </div>
                )}
            </div>
        ),
        style: { width: '8%' },
    },
    {
        field: 'asset_type',
        header: 'Asset Type',
        body: rowData => <span className="text-[#101828]">{rowData.asset_type ?? '--'}</span>,
        style: { width: '8%' },
    },
    {
        field: 'category',
        header: 'Category',
        body: rowData => <span className="text-[#101828]">{rowData.category ?? '--'}</span>,
        style: { width: '10%' },
    },
    {
        field: 'utm_link',
        header: 'UTM link',
        body: rowData => (
            <span className="text-[#101828] truncate block max-w-[150px]" title={rowData.utm_link}>
                {rowData.utm_link ?? '--'}
            </span>
        ),
        style: { width: '12%' },
    },
    {
        field: 'impressions',
        header: 'Impressions',
        body: rowData => <span className="text-[#101828]">{formatNumber(rowData.impressions)}</span>,
        style: { width: '10%' },
    },
    {
        field: 'clicks',
        header: 'Clicks',
        body: rowData => <span className="text-[#101828]">{formatNumber(rowData.clicks)}</span>,
        style: { width: '8%' },
    },
    {
        field: 'ctr',
        header: 'CTR',
        body: rowData => <span className="text-[#101828]">{formatCTR(rowData.ctr)}</span>,
        style: { width: '7%' },
    },
    {
        field: 'callback_confirmed',
        header: 'Call back Confirmed',
        body: rowData => <span className="text-[#101828]">{formatNumber(rowData.callback_confirmed)}</span>,
        style: { width: '12%' },
    },
    {
        field: 'cvr',
        header: 'CVR',
        body: rowData => <span className="text-[#101828]">{formatCVR(rowData.cvr)}</span>,
        style: { width: '7%' },
    },
    {
        field: 'link_status',
        header: 'Link Status',
        body: rowData => <LinkStatus status={rowData.link_status} />,
        style: { width: '12%' },
    },
    {
        field: 'status',
        header: 'Status',
        body: rowData => <StatusBadge statusKey={rowData.status} variant="filled" shape="square" className="text-[10px] font-normal" />,
        style: { width: '10%' },
    },
];

// sample-data.ts
export const submittedData: AdsCampaign[] = [
    {
        campaign_name: 'Cooking Class Event',
        category: 'Interstitial',
        objective: 'Visibility & Engagement',
        sponsorship_period: '2025-12-12 to 2026-02-03',
        cpc_cpm_rates: 'CPM Rate: ₦35, CPC Rate: ₦50',
        total_amount: 145_000_000, // numeric for CurrencyAmount
        submitted_on: '2025-10-12',
        status: 'approved',
    },
    {
        campaign_name: 'Green tea ad',
        category: 'Ad Banner',
        objective: 'Visibility',
        sponsorship_period: '2 months',
        cpc_cpm_rates: 'CPM Rate: ₦35',
        total_amount: 145_000_000,
        submitted_on: '2025-10-12',
        status: 'pending_review',
    },
    {
        campaign_name: 'Toyota',
        category: 'Interstitial',
        objective: 'Engagement',
        sponsorship_period: '2 months',
        cpc_cpm_rates: 'CPC Rate: ₦50',
        total_amount: 145_000_000,
        submitted_on: '2025-10-12',
        status: 'pending_review',
    },
];

export const liveData: AdsCampaign[] = [
    {
        order_id: 1,
        creatives_id: 'CR-3223',
        campaign_name: 'Cooking Class Event',
        category: 'Square Prices',
        objective: 'Engagement',
        start_date: '2025-10-28',
        clicks: 928,
        impressions: undefined,
        days_remaining: '48 days',
    },
    {
        order_id: 2,
        creatives_id: 'CR-3223',
        campaign_name: 'Cooking Class Event',
        category: 'Square Press',
        objective: 'Visibility',
        start_date: '2025-12-27',
        clicks: 1229,
        impressions: undefined,
        days_remaining: '46 days',
    },
    {
        order_id: 3,
        creatives_id: 'CR-3223',
        campaign_name: 'Green tea ad',
        category: 'Ad Banner',
        objective: 'Visibility',
        start_date: '2025-12-28',
        clicks: 233,
        impressions: undefined,
        days_remaining: '14 days',
    },
    {
        order_id: 4,
        creatives_id: 'CR-3223',
        campaign_name: 'Toyota',
        category: 'Square Prices',
        objective: 'Engagement',
        start_date: '2025-10-30',
        clicks: 1860,
        impressions: undefined,
        days_remaining: '14 days',
    },
];

export const creativePerformanceData: AdsCampaign[] = [
    {
        thumbnail_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop',
        asset_type: 'Image',
        category: 'Square Prizes',
        impressions: 45_000_000,
        clicks: 12_000,
        ctr: 3.8,
        days_active: '45 days',
        status: 'active',
    },
    {
        thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
        asset_type: 'Image',
        category: 'Interstitial Ad',
        impressions: 45_000_000,
        clicks: 12_000,
        ctr: 3.8,
        days_active: '63 days',
        status: 'active',
    },
    {
        thumbnail_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop',
        asset_type: 'Video',
        category: 'Ad Banner',
        impressions: 45_000_000,
        clicks: 12_000,
        ctr: 3.8,
        days_active: '63 days',
        status: 'inactive',
    },
];

export const utmTrackerData: AdsCampaign[] = [
    {
        thumbnail_url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop',
        asset_type: 'Image',
        category: 'Square Prizes',
        utm_link: 'https://sponsor.',
        impressions: 45_000_000,
        clicks: 12_000,
        ctr: 3.8,
        callback_confirmed: 13_400,
        cvr: 92,
        link_status: 'live',
        status: 'active',
    },
    {
        thumbnail_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop',
        asset_type: 'Image',
        category: 'Interstitial Ad',
        utm_link: 'https://sponsor.',
        impressions: 45_000_000,
        clicks: 12_000,
        ctr: 3.8,
        callback_confirmed: 13_400,
        cvr: 92,
        link_status: 'callback_pending',
        status: 'active',
    },
    {
        thumbnail_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&h=100&fit=crop',
        asset_type: 'Image',
        category: 'Ad Banner',
        utm_link: 'https://sponsor.',
        impressions: 45_000_000,
        clicks: 12_000,
        ctr: 3.8,
        callback_confirmed: 13_400,
        cvr: 92,
        link_status: 'broken',
        status: 'active',
    },
];
