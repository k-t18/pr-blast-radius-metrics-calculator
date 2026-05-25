import { CaretDoubleRightIcon } from '@phosphor-icons/react';
import HeaderTitle from '../../../../../components/common/HeaderTitle';
import type { QuoteHeaderProperties } from '../../../../../interfaces/quotes/quotes.types';
import LinkButton from '../../../../../components/common/LinkButton';
import { allowedStatuses } from '../QuoteTableColumns';

export function QuoteHeader({ quote, onClose, activeIndex = 0 }: QuoteHeaderProperties) {
    const status = quote?.status?.toLowerCase();
    return (
        <header className="pb-4">
            <button type="button" onClick={onClose} className="cursor-pointer">
                <CaretDoubleRightIcon size={25} weight="bold" />
            </button>
            <div className="mt-3 flex items-center justify-between">
                <HeaderTitle text={`Quote ID: ${quote?.name}`} size="2xl" weight="medium" disabled={false} className="text-black leading-8" />
                {allowedStatuses.includes(status) && (
                    <LinkButton
                        to={`/transactions/orders?id=${quote.name}&tab=${activeIndex}`}
                        textColor="text-white"
                        width="auto"
                        className="p-2! h-fit w-fit text-xs font-normal leading-5 bg-brand-primary-500 border-none border-brand-primary-500 whitespace-nowrap rounded"
                    >
                        View Sales Order
                    </LinkButton>
                )}
            </div>
        </header>
    );
}
