import type { DataTableWrapperColumn } from '../../../../interfaces/common/table.types';
import { CurrencyAmount } from '../../../../components/common/CurrencyAmount';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import { HyphenatedDate } from '../../../../components/common/HyphenatedDate';
import type { OrderRecord } from '../../../../interfaces/orders/orders.types';
import DeadlineStatusChip from '../../../../components/common/DeadlineStatusChip';
import LinkButton from '../../../../components/common/LinkButton';

export const mobileGameColumns: DataTableWrapperColumn<OrderRecord>[] = [
    {
        field: 'name',
        header: 'Order ID',
        body: rowData => rowData?.name,
        style: { width: '15%' },
    },
    {
        field: 'quotation_id',
        header: 'Quote ID',
        body: rowData => rowData?.quotation_id,
        style: { width: '15%' },
    },
    {
        field: 'grand_total',
        header: 'Total Amount',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData?.grand_total} />
            </span>
        ),
        style: { width: '20%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'creation',
        header: 'Created on',
        body: rowData => <HyphenatedDate date={rowData?.creation} />,
        style: { width: '20%' },
    },
    {
        header: 'Prize Agreement Due Date',
        body: rowData =>
            rowData?.is_prize_agreement_available ? (
                <div className="flex flex-col">
                    <DeadlineStatusChip
                        className="text-xs font-medium leading-5"
                        creationDate={rowData?.creation}
                        showDate
                        timelineEventName="studioShowPrizeAgreement"
                        dateClassName="text-[10px] text-black font-normal leading-4"
                    />
                </div>
            ) : (
                ''
            ),
        style: { width: '20%' },
        className: 'prize-agreement',
    },
    {
        header: '',
        body: rowData => (
            <span className="flex items-center justify-end">
                {rowData?.is_prize_agreement_available && !rowData?.custom_prize_agreement ? (
                    <LinkButton
                        to={`/prize-agreement?type=mobile-game&order_id=${rowData.name}&tab=0`}
                        textColor="text-white"
                        width="auto"
                        className="p-2! h-fit w-fit text-xs font-normal leading-5 bg-brand-primary-500 border-none border-brand-primary-500 whitespace-nowrap rounded"
                    >
                        Create Prize Agreement
                    </LinkButton>
                ) : (
                    ''
                )}
            </span>
        ),
        style: { width: '25%', textAlign: 'right' },
    },
];

export const studioShowColumns: DataTableWrapperColumn<OrderRecord>[] = [
    {
        field: 'name',
        header: 'Order ID',
        body: rowData => rowData?.name,
        style: { width: '15%' },
    },
    {
        field: 'quotation_id',
        header: 'Quote ID',
        body: rowData => rowData?.quotation_id,
        style: { width: '15%' },
    },
    {
        field: 'grand_total',
        header: 'Total Amount',
        body: rowData => (
            <span className="flex items-center gap-1 justify-end">
                <CurrencySymbol />
                <CurrencyAmount value={rowData?.grand_total} />
            </span>
        ),
        style: { width: '20%' },
        headerClassName: 'header-total-amount',
    },
    {
        field: 'creation',
        header: 'Created on',
        body: rowData => <HyphenatedDate date={rowData?.creation} />,
        style: { width: '20%' },
    },
    {
        header: 'Prize Agreement Due Date',
        body: rowData =>
            rowData?.is_prize_agreement_available ? (
                <div className="flex flex-col">
                    <DeadlineStatusChip
                        className="text-xs font-medium leading-5"
                        creationDate={rowData?.creation}
                        showDate
                        timelineEventName="studioShowPrizeAgreement"
                        dateClassName="text-[10px] text-black font-normal leading-4"
                    />
                </div>
            ) : (
                ''
            ),
        style: { width: '20%' },
        className: 'prize-agreement',
    },
    {
        header: '',
        body: rowData => (
            <span className="flex items-center justify-end">
                {rowData?.is_prize_agreement_available && !rowData?.custom_prize_agreement ? (
                    <LinkButton
                        to={`/prize-agreement?type=studio-show&order_id=${rowData.name}&tab=1`}
                        textColor="text-white"
                        width="auto"
                        className="p-2! h-fit w-fit text-xs font-normal leading-5 bg-brand-primary-500 border-none border-brand-primary-500 whitespace-nowrap rounded"
                    >
                        Create Prize Agreement
                    </LinkButton>
                ) : (
                    ''
                )}
            </span>
        ),
        style: { width: '25%', textAlign: 'right' },
    },
];
