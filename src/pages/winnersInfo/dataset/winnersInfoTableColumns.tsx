import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import { HyphenatedDate } from '../../../components/common/HyphenatedDate';
import StatusBadge from '../../../components/common/StatusBadge';
import type { DataTableWrapperColumn } from '../../../interfaces/common/table.types';
import { Check, Hourglass } from '../../../components/icons';

export const TABS = [
    { label: 'Mobile Game', value: 'mobile-game' },
    { label: 'Studio Show', value: 'studio-show' },
] as const;

export type WinnersTabValue = (typeof TABS)[number]['value'];

// Mobile Games Data Types (aligned to API response)
export interface MobileGameReward {
    row: number | null;
    square_type: string | null;
    quantity: number;
    total_players: number;
    reward_type: string;
    description: string;
    total_amount: number;
    remaining_amount: number;
    maximum_winner: number | null;
}

// Studio Shows Data Types (aligned to API response)
export interface StudioShowWinner {
    player_name: string;
    episode: string | null;
    square: string | null;
    reward_type: string;
    description: string;
    amount: number;
    creation_date?: string | null;
    // Backward-compat fallback (some responses may still send `creation`)
    creation?: string | null;
    status_of_disbursement: string | null;
}

/**
 * Renders reward type badge with light purple background
 */
function RewardTypeBadge({ rewardType }: { rewardType: string }) {
    return (
        <StatusBadge
            label={rewardType}
            bgColor="#E9D5FF"
            textColor="#101828"
            borderColor="#E9D5FF"
            variant="filled"
            shape="square"
            className="text-xs font-normal"
        />
    );
}

/**
 * Renders disbursement status badge
 */
function DisbursementStatusBadge({ status }: { status: string | null | undefined }) {
    if (!status) {
        return null;
    }

    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'disbursed') {
        return (
            <StatusBadge
                label="Disbursed"
                bgColor="#D1FAE5"
                textColor="#065F46"
                borderColor="#D1FAE5"
                variant="filled"
                shape="square"
                className="text-xs font-normal"
                icon={<Check size={12} />}
            />
        );
    }
    if (normalizedStatus === 'pending') {
        return (
            <StatusBadge
                label="Pending"
                bgColor="#FEF3C7"
                textColor="#92400E"
                borderColor="#FEF3C7"
                variant="filled"
                shape="square"
                className="text-xs font-normal"
                icon={<Hourglass size={12} />}
            />
        );
    }

    return (
        <StatusBadge
            label={status}
            bgColor="#E5E7EB"
            textColor="#374151"
            borderColor="#E5E7EB"
            variant="filled"
            shape="square"
            className="text-xs font-normal"
        />
    );
}

// Mobile Games Columns
export const mobileGameColumns: DataTableWrapperColumn<MobileGameReward>[] = [
    { field: 'row', header: 'Row', style: { width: '5%' } },
    {
        field: 'square_type',
        header: 'Square Type & Qty',
        body: rowData => (
            <div className="flex flex-col items-center gap-1">
                <span className="text-[#101828]">{rowData.square_type || '-'}</span>
                <span className="text-[#101828]">Qty: {rowData.quantity}</span>
            </div>
        ),
        style: { width: '15%' },
    },
    { field: 'total_players', header: 'Winners Count', style: { width: '10%' } },
    {
        field: 'reward_type',
        header: 'Reward Type',
        body: rowData => <RewardTypeBadge rewardType={rowData.reward_type} />,
        style: { width: '10%' },
    },
    {
        field: 'description',
        header: 'Reward Details',
        body: rowData => (
            <span className="text-[#101828]">
                {rowData.description || '-'}
                {/* {rowData.total_amount ? (
                    <span className="ml-1 inline-flex items-center gap-1">
                        (<CurrencySymbol />
                        <CurrencyAmount value={rowData.total_amount} className="text-[#101828]" />)
                    </span>
                ) : null} */}
            </span>
        ),
        style: { width: '15%' },
    },
    {
        field: 'total_amount',
        header: 'Total Reward Amount',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData.total_amount} className="text-[#101828]" />
            </span>
        ),
        style: { width: '15%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'remaining_amount',
        header: 'Amount Remaining',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData.remaining_amount} className="text-[#101828]" />
            </span>
        ),
        style: { width: '15%' },
        headerClassName: 'header-total-amount',
    },
    { field: 'maximum_winner', header: 'Maximum Winners', style: { width: '30%' } },
];

// Studio Shows Columns
export const studioShowColumns: DataTableWrapperColumn<StudioShowWinner>[] = [
    { field: 'player_name', header: 'Player Name', style: { width: '15%' } },
    { field: 'episode', header: 'Season & Episode', style: { width: '15%' } },
    { field: 'square', header: 'Square', style: { width: '15%' } },
    {
        field: 'reward_type',
        header: 'Reward Type',
        body: rowData => <RewardTypeBadge rewardType={rowData.reward_type} />,
        style: { width: '12%' },
    },
    {
        field: 'description',
        header: 'Reward Details',
        body: rowData => (
            <span className="text-[#101828]">
                {rowData.description || '-'}
                {rowData.amount ? (
                    <span className="ml-1 inline-flex items-center gap-1">
                        (<CurrencySymbol />
                        <CurrencyAmount value={rowData.amount} className="text-[#101828]" />)
                    </span>
                ) : null}
            </span>
        ),
        style: { width: '20%' },
    },
    {
        field: 'creation_date',
        header: 'Awarded On',
        body: rowData => <HyphenatedDate date={rowData.creation_date ?? rowData.creation ?? ''} className="text-[#101828]" />,
        style: { width: '10%' },
    },
    {
        field: 'status_of_disbursement',
        header: 'Disbursement Status',
        body: rowData => <DisbursementStatusBadge status={rowData.status_of_disbursement} />,
        style: { width: '15%' },
    },
];
