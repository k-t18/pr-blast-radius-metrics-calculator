import type { QuoteBodyProperties } from '../../../../../interfaces/quotes/quotes.types';
import { CurrencySymbol } from '../../../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../../../components/common/CurrencyAmount';
import { HyphenatedDate } from '../../../../../components/common/HyphenatedDate';
import StatusBadge from '../../../../../components/common/StatusBadge';

export function QuoteBody({ quote }: QuoteBodyProperties) {
    return (
        <section className="mt-4 text-sm">
            <div className="flex gap-[50px] pl-[10px]">
                <span className="font-normal leading-6 text-black">Total Amount</span>
                <span className="flex items-center gap-1 text-black">
                    <CurrencySymbol className="font-ubuntu" />
                    <CurrencyAmount value={quote.grand_total} className="font-ubuntu" />
                </span>
            </div>
            <div className="flex gap-[50px] pl-[10px] mt-[14px]">
                <span className="font-normal leading-6 text-black">Submitted on</span>
                <HyphenatedDate date={quote?.creation} className="text-black font-ubuntu" />
            </div>
            <div className="flex gap-[75px] pl-[10px] mt-[14px]">
                <span className="font-normal leading-6 text-black">Items Qty</span>
                <span className="text-black font-ubuntu">{quote?.items_count}</span>
            </div>
            <div className="flex items-center gap-[90px] pl-[10px] mt-[14px]">
                <span className="font-normal leading-6 text-black">Status</span>
                {quote?.status && (
                    <StatusBadge statusKey={quote?.status} showIcon={false} variant="filled" shape="square" className="text-[10px] font-normal" />
                )}
            </div>
        </section>
    );
}
