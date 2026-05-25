import { useState } from 'react';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import StatusBadge from '../../../components/common/StatusBadge';
import ActionButton from '../../../components/common/ActionButton';
import { Download, ShareNetwork } from '../../../components/icons';
import type { DataTableWrapperColumn } from '../../../interfaces/common/table.types';
import type { NGOPartnershipItem } from '../../../interfaces/csr/ngoPartnershipList.types';

export interface LeaderBoardData {
    ranking: number;
    sponsor_name: string;
    amount_donated: number;
    beneficiaries_reached?: number;
    impact_score?: number;
}

export const leaderBoardColumns: DataTableWrapperColumn<LeaderBoardData>[] = [
    { field: 'ranking', header: 'Ranking', style: { width: '7%' } },
    { field: 'sponsor_name', header: 'Sponsor Name', style: { width: '10%' } },
    {
        field: 'amount_donated',
        header: 'Amount Donated',
        body: (rowData: LeaderBoardData) => (
            <span className="flex items-center gap-1 justify-end font-ubuntu">
                <CurrencySymbol />
                <CurrencyAmount value={rowData?.amount_donated ?? 0} className="text-[#101828]" />
            </span>
        ),
        style: { width: '13%' },
        headerClassName: 'header-total-amount',
    },
    // Extra columns are intentionally omitted as per requirements:
    // - Beneficiaries Reached
    // - Impact Score
];

export const leaderBoardData: LeaderBoardData[] = [
    {
        ranking: 1,
        sponsor_name: 'Company Name',
        amount_donated: 145_000_000,
        beneficiaries_reached: 203_009,
        impact_score: 190,
    },
    {
        ranking: 2,
        sponsor_name: 'Company Name',
        amount_donated: 120_500_000,
        beneficiaries_reached: 175_432,
        impact_score: 185,
    },
    {
        ranking: 3,
        sponsor_name: 'Company Name',
        amount_donated: 200_750_000,
        beneficiaries_reached: 250_010,
        impact_score: 210,
    },
    {
        ranking: 4,
        sponsor_name: 'Company Name',
        amount_donated: 95_300_000,
        beneficiaries_reached: 150_800,
        impact_score: 170,
    },
];

function openInNewTab(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

async function downloadCertificateWithAuth(certificateUrl: string) {
    if (!certificateUrl) {
        openInNewTab(certificateUrl);
        return;
    }

    try {
        const response = await fetch(certificateUrl, {
            method: 'GET',
            headers: { Accept: 'application/pdf' },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to download certificate');
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        openInNewTab(blobUrl);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 30_000);
    } catch {
        openInNewTab(certificateUrl);
    }
}

function CertificateCell({ certificate }: { certificate?: string | null }) {
    const [loading, setLoading] = useState(false);

    if (!certificate) {
        return <span className="flex justify-end text-sm text-gray-500">No file</span>;
    }

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await downloadCertificateWithAuth(certificate);
        } finally {
            setLoading(false);
        }
    };

    return (
        <span className="flex items-center justify-end">
            <ActionButton
                borderRadius="rounded"
                width="auto"
                borderColor="border-gray-600"
                bgColor="bg-white"
                textColor="text-text-charcoal"
                className="px-4 font-normal text-xs leading-5 text-text-charcoal hover:bg-gray-50"
                onClick={handleClick}
                disabled={loading}
            >
                <span className="flex justify-center gap-2 items-center">
                    <Download size={12} color="currentColor" />
                    <span>{loading ? 'Loading...' : 'Certificate'}</span>
                </span>
            </ActionButton>
        </span>
    );
}

function getFocusArea(rowData: NGOPartnershipItem & { ['focus_area ']?: string | null }) {
    return rowData.focus_area ?? rowData['focus_area '] ?? 'N/A';
}

function ShareCell({ rowData, onShare }: { rowData: NGOPartnershipItem; onShare: (item: NGOPartnershipItem) => void }) {
    // Only show share button if image exists
    if (!rowData.image) {
        return null;
    }

    return (
        <span className="flex items-center justify-end">
            <ActionButton
                borderRadius="rounded"
                width="auto"
                borderColor="border-gray-600"
                bgColor="bg-white"
                textColor="text-text-charcoal"
                className="px-4 font-normal text-xs leading-5 text-text-charcoal hover:bg-gray-50"
                onClick={() => onShare(rowData)}
            >
                <span className="flex justify-center gap-2 items-center">
                    <ShareNetwork size={12} color="currentColor" />
                    <span>Share</span>
                </span>
            </ActionButton>
        </span>
    );
}

export const getNgoPartnershipColumns = (onShare: (item: NGOPartnershipItem) => void): DataTableWrapperColumn<NGOPartnershipItem>[] => [
    { field: 'name', header: 'CSR ID', style: { width: '10%' } },
    { field: 'ngo_name', header: 'NGO Name', style: { width: '15%' } },
    {
        field: 'focus_area',
        header: 'Focus Area',
        body: (rowData: NGOPartnershipItem) => (
            <StatusBadge
                label={getFocusArea(rowData)}
                bgColor="#E6E6FA"
                textColor="#6A0DAD"
                borderColor="#E6E6FA"
                variant="filled"
                shape="square"
                showIcon={false}
                className="text-xs font-normal"
            />
        ),
        style: { width: '12%' },
    },
    {
        field: 'csr_amount',
        header: 'CSR Amount',
        body: (rowData: NGOPartnershipItem) => (
            <span className="flex items-center gap-1 justify-end font-ubuntu">
                <CurrencySymbol />
                <CurrencyAmount value={rowData?.csr_amount ?? 0} className="text-[#101828]" />
            </span>
        ),
        style: { width: '13%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'paid_amount',
        header: 'Paid Amount',
        body: (rowData: NGOPartnershipItem) => (
            <span className="flex items-center gap-1 justify-end font-ubuntu">
                <CurrencySymbol />
                <CurrencyAmount value={rowData?.paid_amount ?? 0} className="text-[#101828]" />
            </span>
        ),
        style: { width: '13%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'status',
        header: 'Status',
        body: (rowData: NGOPartnershipItem) => {
            if (!rowData?.status) {
                return null;
            }
            return <StatusBadge statusKey={rowData.status} variant="filled" shape="square" className="text-xs font-normal" />;
        },
        style: { width: '12%' },
    },
    { field: 'episode', header: 'Episode', style: { width: '15%' } },
    {
        header: '',
        body: (rowData: NGOPartnershipItem) => {
            return <CertificateCell certificate={rowData.certificate} />;
        },
        style: { width: '15%', textAlign: 'right' },
    },
    {
        header: '',
        body: (rowData: NGOPartnershipItem) => <ShareCell rowData={rowData} onShare={onShare} />,
        style: { width: '10%', textAlign: 'right' },
    },
];
