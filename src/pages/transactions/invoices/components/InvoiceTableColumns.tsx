import type { DataTableWrapperColumn } from '../../../../interfaces/common/table.types';
import type { InvoiceRecord } from '../../../../interfaces/invoices/invoices.types';
import { CurrencyAmount } from '../../../../components/common/CurrencyAmount';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import { HyphenatedDate } from '../../../../components/common/HyphenatedDate';
import StatusBadge from '../../../../components/common/StatusBadge';

export const mobileGameColumns: DataTableWrapperColumn<InvoiceRecord>[] = [
    {
        field: 'custom_quotation',
        header: 'Quote ID',
        body: rowData => rowData.custom_quotation,
        style: { width: '15%' },
    },
    { field: 'custom_sales_order', header: 'Order ID', style: { width: '15%' } },
    { field: 'name', header: 'Invoice ID', style: { width: '15%' } },
    {
        field: 'grand_total',
        header: 'Total Amount',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData.grand_total} />
            </span>
        ),
        style: { width: '20%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'creation',
        header: 'Created On',
        body: rowData => <HyphenatedDate date={rowData.creation} />,
        style: { width: '20%' },
    },
    {
        field: 'status',
        header: 'Status',
        body: rowData => <StatusBadge statusKey={rowData?.status} variant="filled" shape="square" className="text-[10px] font-normal" />,
        style: { width: '20%' },
    },
];

export const studioShowColumns: DataTableWrapperColumn<InvoiceRecord>[] = [
    {
        field: 'custom_quotation',
        header: 'Quote ID',
        body: rowData => rowData.custom_quotation,
        style: { width: '15%' },
    },
    { field: 'custom_sales_order', header: 'Order ID', style: { width: '15%' } },
    { field: 'name', header: 'Invoice ID', style: { width: '15%' } },
    {
        field: 'grand_total',
        header: 'Total Amount',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData.grand_total} />
            </span>
        ),
        style: { width: '20%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'creation',
        header: 'Created On',
        body: rowData => <HyphenatedDate date={rowData.creation} />,
        style: { width: '20%' },
    },
    {
        field: 'status',
        header: 'Status',
        body: rowData => <StatusBadge statusKey={rowData?.status} variant="filled" shape="square" className="text-[10px] font-normal" />,
        style: { width: '20%' },
    },
];
