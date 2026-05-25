import ActionButton from '../../../components/common/ActionButton';
import { HyphenatedDate } from '../../../components/common/HyphenatedDate';
import StatusBadge from '../../../components/common/StatusBadge';
import type { DataTableWrapperColumn } from '../../../interfaces/common/table.types';
import type { SubmittedCreative } from '../../../interfaces/creatives/creatives.types';

export const getStudioShowColumns = (onViewRemarks: (remark: string) => void): DataTableWrapperColumn<SubmittedCreative>[] => [
    { field: 'order_id', header: 'Order ID', style: { width: '10%' } },
    { field: 'creatives_id', header: 'Creatives ID', style: { width: '12%' } },
    { field: 'asset_type', header: 'Asset Type', style: { width: '12%' } },
    {
        field: 'placement',
        header: 'Placement',
        body: rowData => <span className="text-black">{`${rowData?.placement || ''}-${rowData?.square || ''}-${rowData?.square_type || ''}`}</span>,
        style: { width: '12%' },
    },
    {
        header: 'File',
        field: 'file',
        body: rowData => (
            <a
                href={`https://example.com/files/${rowData.file}`}
                className="text-black underline hover:text-brand-primary-600"
                target="_blank"
                rel="noreferrer"
            >
                {rowData.file}
            </a>
        ),
        style: { width: '12%' },
    },
    {
        header: 'Submitted On',
        field: 'submitted_on',
        body: rowData => <HyphenatedDate date={rowData?.submitted_on} className="text-[#101828]" />,
        style: { width: '12%' },
    },
    {
        header: 'Status',
        field: 'status',
        body: rowData => {
            if (!rowData?.status) return '';
            return <StatusBadge statusKey={rowData?.status} variant="filled" shape="square" className="text-[10px] font-normal" />;
        },
        style: { width: '10%' },
    },
    {
        header: '',
        body: rowData => {
            const status = rowData?.status?.toLowerCase();
            if (status === 'rejected') {
                return (
                    <div className="flex justify-end gap-2">
                        <ActionButton
                            bgColor="bg-brand-primary-500"
                            textColor="text-white"
                            borderRadius="rounded"
                            width="auto"
                            className="min-h-9 w-fit text-xs font-normal leading-5 px-3 py-1"
                        >
                            Re Upload
                        </ActionButton>
                        <ActionButton
                            bgColor="bg-white"
                            textColor="text-primary-text"
                            borderColor="border-gray-600"
                            borderRadius="rounded"
                            width="auto"
                            className="min-h-9 w-fit text-xs font-normal leading-5 px-3 py-1"
                            onClick={() => onViewRemarks(rowData?.remarks || '')}
                        >
                            View Remarks
                        </ActionButton>
                    </div>
                );
            }
        },
        style: { width: '25%', textAlign: 'right' },
    },
];

export const getMobileGameColumns = (onViewRemarks: (remark: string) => void): DataTableWrapperColumn<SubmittedCreative>[] => [
    { field: 'order_id', header: 'Order ID', style: { width: '8%' } },
    { field: 'creatives_id', header: 'Creatives ID', style: { width: '8%' } },
    { field: 'sponsorship_type', header: 'Sponsorship Type', style: { width: '10%' } },
    { field: 'asset_type', header: 'Asset Type', style: { width: '8%' } },
    {
        field: 'placement',
        header: 'Placement',
        body: rowData => <span className="text-black">{`${rowData?.placement || ''}-${rowData?.square || ' '}-${rowData?.square_type || ''}`}</span>,
        style: { width: '10%' },
    },
    {
        header: 'File',
        field: 'file',
        body: rowData => (
            <a
                href={`https://example.com/files/${rowData.file}`}
                className="text-black underline hover:text-brand-primary-600"
                target="_blank"
                rel="noreferrer"
            >
                {rowData.file}
            </a>
        ),
        style: { width: '8%' },
    },
    {
        header: 'UTM Link',
        field: 'utm_link',
        body: rowData => (
            <a
                href={rowData.utm_link || 'https://example.com/utm-link'}
                className="text-black underline hover:text-brand-primary-600"
                target="_blank"
                rel="noreferrer"
            >
                {rowData.utm_link || ''}
            </a>
        ),
        style: { width: '8%' },
    },
    {
        header: 'Submitted On',
        field: 'submitted_on',
        body: rowData => <HyphenatedDate date={rowData.submitted_on} className="text-[#101828]" />,
        style: { width: '10%' },
    },
    {
        header: 'Status',
        field: 'status',
        body: rowData => {
            if (!rowData?.status) return '';
            return <StatusBadge statusKey={rowData?.status || ''} variant="filled" shape="square" className="text-[10px] font-normal" />;
        },
        style: { width: '10%' },
    },
    {
        header: '',
        body: rowData => {
            const status = rowData?.status?.toLowerCase();
            if (status === 'rejected') {
                return (
                    <div className="flex justify-end gap-2">
                        <ActionButton
                            bgColor="bg-brand-primary-500"
                            textColor="text-white"
                            borderRadius="rounded"
                            width="auto"
                            className="min-h-9 w-fit text-xs font-normal leading-5 px-3 py-1"
                        >
                            Re Upload
                        </ActionButton>
                        <ActionButton
                            bgColor="bg-white"
                            textColor="text-primary-text"
                            borderColor="border-gray-600"
                            borderRadius="rounded"
                            width="auto"
                            className="min-h-9 w-fit text-xs font-normal leading-5 px-3 py-1"
                            onClick={() => onViewRemarks(rowData?.remarks || '')}
                        >
                            View Remarks
                        </ActionButton>
                    </div>
                );
            }
        },
        style: { width: '25%', textAlign: 'right' },
    },
];
