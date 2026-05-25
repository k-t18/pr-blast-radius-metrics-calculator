import type { DataTableWrapperColumn } from '../../../../interfaces/common/table.types';
import type { Quote } from '../../../../interfaces/quotes/quotes.types';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../../components/common/CurrencyAmount';
import { HyphenatedDate } from '../../../../components/common/HyphenatedDate';
import StatusBadge from '../../../../components/common/StatusBadge';
import LinkButton from '../../../../components/common/LinkButton';

export const allowedStatuses = ['partially ordered', 'ordered', 'approved'];

export const mobileGameColumns: DataTableWrapperColumn<Quote>[] = [
    { field: 'name', header: 'Quote ID', body: rowData => rowData.name, style: { width: '25%' } },
    {
        header: 'Blanket Order',
        field: 'quotation_created_against_blanket_order',
        body: rowData => {
            if (rowData.quotation_created_against_blanket_order) {
                return <span>Yes</span>;
            }
            return <span>No</span>;
        },
        style: { width: '25%' },
    },
    {
        field: 'grand_total',
        header: 'Total Amount',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData.grand_total} />
            </span>
        ),
        style: { width: '25%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'creation',
        header: 'Submitted on',
        body: rowData => <HyphenatedDate date={rowData.creation} />,
        style: { width: '15%' },
    },
    {
        field: 'status',
        header: 'Status',
        body: rowData => <StatusBadge statusKey={rowData?.status} variant="filled" shape="square" className="text-[10px] font-normal" />,
        style: { width: '20%' },
    },
    {
        header: '',
        body: rowData => {
            const status = rowData?.status?.toLowerCase();
            if (allowedStatuses.includes(status)) {
                return (
                    <span className="flex items-center justify-end">
                        <LinkButton
                            to={`/transactions/orders?id=${rowData.name}&tab=0`}
                            textColor="text-white"
                            width="auto"
                            className="p-2! h-fit w-fit text-xs font-normal leading-5 bg-brand-primary-500 border-none border-brand-primary-500 whitespace-nowrap rounded"
                        >
                            View Sales Order
                        </LinkButton>
                    </span>
                );
            }
        },
        style: { width: '25%', textAlign: 'right' },
    },
];

export const studioShowColumns: DataTableWrapperColumn<Quote>[] = [
    { field: 'name', header: 'Quote ID', body: rowData => rowData.name, style: { width: '25%' } },
    {
        header: 'Blanket Order',
        field: 'quotation_created_against_blanket_order',
        body: rowData => {
            if (rowData.quotation_created_against_blanket_order) {
                return <span>Yes</span>;
            }
            return <span>No</span>;
        },
        style: { width: '25%' },
    },
    {
        field: 'grand_total',
        header: 'Total Amount',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData.grand_total} />
            </span>
        ),
        style: { width: '25%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'creation',
        header: 'Submitted on',
        body: rowData => <HyphenatedDate date={rowData.creation} />,
        style: { width: '15%' },
    },
    {
        field: 'status',
        header: 'Status',
        body: rowData => <StatusBadge statusKey={rowData?.status} variant="filled" shape="square" className="text-[10px] font-normal" />,
        style: { width: '20%' },
    },
    {
        header: '',
        body: rowData => {
            const status = rowData?.status?.toLowerCase();
            if (allowedStatuses.includes(status)) {
                return (
                    <span className="flex items-center justify-end">
                        <LinkButton
                            to={`/transactions/orders?id=${rowData.name}&tab=1`}
                            textColor="text-white"
                            width="auto"
                            className="p-2! h-fit w-fit text-xs font-normal leading-5 bg-brand-primary-500 border-none border-brand-primary-500 whitespace-nowrap rounded"
                        >
                            View Sales Order
                        </LinkButton>
                    </span>
                );
            }
        },
        style: { width: '25%', textAlign: 'right' },
    },
];
