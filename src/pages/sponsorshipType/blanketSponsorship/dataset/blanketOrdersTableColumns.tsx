import ActionButton from '../../../../components/common/ActionButton';
import { CurrencyAmount } from '../../../../components/common/CurrencyAmount';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import { HyphenatedDate } from '../../../../components/common/HyphenatedDate';
import StatusBadge from '../../../../components/common/StatusBadge';
import { formatNumber } from '../../../../utils/extractors';
import type { DataTableWrapperColumn } from '../../../../interfaces/common/table.types';
import type { BlanketOrderListItem } from '../../../../services/blanketSponsorship/getBlanketOrderList.api';

export const getColumns = (onViewRemarks: (remark: string) => void): DataTableWrapperColumn<BlanketOrderListItem>[] => [
    {
        field: 'id',
        header: 'Blanket Order ID',
        body: rowData => rowData.id,
        style: { width: '15%' },
    },
    {
        field: 'created_on',
        header: 'Submitted On',
        body: rowData => <HyphenatedDate date={rowData.created_on} className="text-[#101828]" />,
        style: { width: '15%' },
    },
    {
        field: 'rate',
        header: 'Budget',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData.rate} className="text-[#101828]" />
            </span>
        ),
        style: { width: '20%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'start_date',
        header: 'Start Date',
        body: rowData => <HyphenatedDate date={rowData.start_date} className="text-[#101828]" />,
        style: { width: '15%' },
    },
    {
        field: 'duration',
        header: 'Duration (months)',
        body: rowData => <span className="text-[#101828]">{formatNumber(rowData.duration)}</span>,
        style: { width: '10%' },
    },
    {
        field: 'status',
        header: 'Status',
        body: rowData => <StatusBadge statusKey={rowData.status} variant="filled" shape="pill" />,
        style: { width: '15%' },
    },
    {
        header: '',
        body: rowData => (
            <div className="flex justify-end">
                {rowData.status === 'Rejected' && (
                    <ActionButton
                        bgColor="bg-white"
                        textColor="text-primary-text"
                        borderColor="#D6D6D6"
                        borderRadius="rounded"
                        width="auto"
                        className="min-h-9 text-xs font-normal leading-5 border w-fit"
                        onClick={() => onViewRemarks(rowData.remarks || '')}
                    >
                        View Remarks
                    </ActionButton>
                )}
            </div>
        ),
        style: { width: '15%' },
    },
];
