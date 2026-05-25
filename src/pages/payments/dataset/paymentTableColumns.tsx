import { CurrencyAmount } from '../../../components/common/CurrencyAmount';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import ActionButton from '../../../components/common/ActionButton';
import { HyphenatedDate } from '../../../components/common/HyphenatedDate';
import StatusBadge from '../../../components/common/StatusBadge';
import type { DataTableWrapperColumn } from '../../../interfaces/common/table.types';
import type { PaymentRecord } from '../../../interfaces/payments/payments.types';
import { Download } from '../../../components/icons';
import LinkButton from '../../../components/common/LinkButton';

export interface UnpaidColumnsOptions {
    onMakePaymentFromRow?: (payment: PaymentRecord) => void;
}

export const paidColumns: DataTableWrapperColumn<PaymentRecord>[] = [
    {
        field: 'invoice_id',
        header: 'Transaction ID',
        body: rowData => rowData?.invoice_id || '',
        style: { width: '10%' },
    },

    {
        field: 'prize_agreement',
        header: 'Prize Agreement',
        style: { width: '10%' },
    },
    {
        field: 'sponsorship_type',
        header: 'Sponsorship Type',
        body: rowData =>
            rowData?.sponsorship_type && (
                <StatusBadge
                    statusKey={rowData?.sponsorship_type}
                    variant="filled"
                    showIcon={false}
                    shape="square"
                    className="payment-status text-[10px] font-normal leading-4"
                />
            ),
        style: { width: '15%' },
    },
    {
        field: 'amount',
        header: 'Amount Paid',
        body: rowData => (
            <span className="flex items-center gap-1">
                <CurrencySymbol />
                <CurrencyAmount value={rowData?.amount || 0} className="text-[#101828]" />
            </span>
        ),
        style: { width: '15%' },
    },
    {
        field: 'outstanding_amount',
        header: 'Outstanding',
        body: rowData => (
            <span className="flex items-center gap-1">
                <CurrencySymbol />
                <CurrencyAmount value={rowData?.outstanding_amount || 0} className="text-[#101828]" />
            </span>
        ),
        style: { width: '15%' },
    },
    { field: 'payment_mode', header: 'Payment mode', style: { width: '12%' } },
    {
        field: 'payment_status',
        header: 'Payment Status',
        body: rowData =>
            rowData?.payment_status && (
                <StatusBadge
                    statusKey={rowData?.payment_status}
                    showIcon={false}
                    variant="filled"
                    shape="square"
                    className="text-[10px] font-normal"
                />
            ),
        style: { width: '10%' },
    },
    {
        field: 'payment_date',
        header: 'Payment Date',
        body: rowData => (rowData?.payment_date ? <HyphenatedDate date={rowData.payment_date} className="text-[#101828]" /> : '--'),
        style: { width: '10%' },
    },
    {
        header: '',
        body: rowData => (
            <LinkButton
                to={`${rowData?.receipt || ''}`}
                textColor="text-text-charcoal"
                width="auto"
                targetBlank="_blank"
                className="p-2! gap-2 flex items-center text-xs font-normal border border-border-gray-600 rounded leading-5"
            >
                <div className="flex justify-center gap-[5px]">
                    <span className="self-center">
                        <Download size={12} color="text-black" />
                    </span>
                    <span>Receipt</span>
                </div>
            </LinkButton>
        ),
        style: { width: '8%', textAlign: 'right' },
    },
];

export const getUnpaidColumns = (options?: UnpaidColumnsOptions): DataTableWrapperColumn<PaymentRecord>[] => [
    {
        field: 'invoice_id',
        header: 'Transaction ID',
        body: rowData => rowData?.invoice_id,
        style: { width: '12%' },
    },
    {
        field: 'prize_agreement',
        header: 'Prize Agreement',
        style: { width: '12%' },
    },
    {
        field: 'sponsorship_type',
        header: 'Sponsorship Type',
        body: rowData =>
            rowData?.sponsorship_type && (
                <StatusBadge
                    statusKey={rowData?.sponsorship_type || ''}
                    variant="filled"
                    showIcon={false}
                    shape="square"
                    className="payment-status text-[10px] font-normal leading-4"
                />
            ),
        style: { width: '15%' },
    },
    {
        field: 'amount',
        header: 'Amount to be Paid',
        body: rowData => (
            <span className="flex items-center gap-1">
                <CurrencySymbol />
                <CurrencyAmount value={rowData?.amount || 0} className="text-[#101828]" />
            </span>
        ),
        style: { width: '15%' },
    },
    {
        field: 'payment_status',
        header: 'Payment Status',
        body: rowData =>
            rowData?.payment_status && (
                <StatusBadge
                    statusKey={rowData?.payment_status}
                    variant="filled"
                    showIcon={false}
                    shape="square"
                    className="text-[10px] font-normal leading-4"
                />
            ),
        style: { width: '12%' },
    },
    {
        field: 'due_on',
        header: 'Due on',
        body: rowData => (rowData?.due_on ? <HyphenatedDate date={rowData?.due_on} className="text-[#101828]" /> : '--'),
        style: { width: '12%' },
    },
    {
        field: 'age_days',
        header: 'Aging (Days)',
        body: rowData => ((rowData?.age_days ?? 0) > 0 ? rowData.age_days : 0),
        style: { width: '10%' },
    },
    {
        header: '',
        body: rowData => (
            <ActionButton
                borderRadius="rounded"
                width="auto"
                className="min-h-9 w-fit text-xs font-normal leading-5 focus-visible:outline focus-visible:outline-offset-2"
                onClick={event => {
                    event.stopPropagation();
                    if (rowData && options?.onMakePaymentFromRow) {
                        options.onMakePaymentFromRow(rowData);
                    }
                }}
                isDisabled={!rowData.amount}
            >
                Make Payment
            </ActionButton>
        ),
        style: { width: '12%', textAlign: 'right' },
    },
];
