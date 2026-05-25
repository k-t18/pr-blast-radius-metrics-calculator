import { CurrencySymbol } from '../../../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../../../components/common/CurrencyAmount';
import { HyphenatedDate } from '../../../../../components/common/HyphenatedDate';
import DeadlineStatusChip from '../../../../../components/common/DeadlineStatusChip';
import type { OrderBodyProperties } from '../../../../../interfaces/orders/orders.types';

export function OrderBody({ order }: OrderBodyProperties) {
    return (
        <section className="mt-4 space-y-3 text-sm pl-[10px]">
            <div className="flex gap-[140px]">
                <span className="font-normal leading-6 text-black">Linked Quote</span>
                <span className="text-black">{order.quotation_id}</span>
            </div>
            <div className="flex gap-[140px]">
                <span className="font-normal leading-6 text-black">Total Amount</span>
                <span className="flex items-center gap-1 text-black">
                    <CurrencySymbol className="font-ubuntu" />
                    <CurrencyAmount value={order.grand_total} className="font-ubuntu" />
                </span>
            </div>
            <div className="flex gap-[155px]">
                <span className="font-normal leading-6 text-black">Created on</span>
                <HyphenatedDate date={order.creation} className="text-black font-ubuntu" />
            </div>
            <div className="flex gap-[40px]">
                <span className="font-normal leading-6 text-black">Prize Agreement Due Date</span>
                <div className="flex items-center text-black gap-[10px]">
                    <DeadlineStatusChip
                        creationDate={order.creation}
                        className="font-ubuntu deadline-date"
                        timelineEventName="studioShowPrizeAgreement"
                        dateClassName="text-black text-[10px]"
                        showDate
                    />
                </div>
            </div>
            <div className="flex gap-[170px]">
                <span className="font-normal leading-6 text-black">Items Qty</span>
                <span className="text-black">{order.items_count ?? 0}</span>
            </div>
        </section>
    );
}
