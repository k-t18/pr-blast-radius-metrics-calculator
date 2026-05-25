import type { AccordionTabChangeEvent } from 'primereact/accordion';
import HeaderTitle from '../common/HeaderTitle';
import { CurrencySymbol } from '../common/CurrencySymbol';
import { CurrencyAmount } from '../common/CurrencyAmount';
import DeadlineStatusChip from '../common/DeadlineStatusChip';
import Accordion from '../common/Accordion';
import type { AccordionItem } from '../common/Accordion';
import { Money } from '../icons';
import type { TimelineEventNameTypes } from '../../interfaces/common/timelineEventName.types';
import '../../styles/tabViewCard.css';
import ActionButton from '../common/ActionButton';

interface TabViewCardProperties {
    title: string;
    amount: number;
    creationDate: string;
    timelineEventName: TimelineEventNameTypes[keyof TimelineEventNameTypes];
    // Accordion props
    accordionItems: AccordionItem[];
    activeIndex?: number | number[] | null;
    onTabChange?: (event: AccordionTabChangeEvent) => void;
    accordionClassName?: string;

    // button props
    isSubmitting?: boolean;
    areAllItemsSaved?: boolean;
    buttonLabel?: string;
    cardSubmitHandler?: () => void;
}

function RenderTotalAmount({ amount }: { amount: number }) {
    return (
        <div className="inline-flex items-center gap-2 rounded border border-gray-600  px-3 py-2 text-sm font-medium text-dark leading-[22px]">
            <Money size={16} />
            <span className="text-text-dark">Total Order Amount:</span>
            <CurrencySymbol className="font-semibold text-black" />
            <CurrencyAmount value={amount} className="text-black" />
        </div>
    );
}

function TabViewCard({
    title,
    amount,
    creationDate,
    timelineEventName,
    accordionItems,
    activeIndex,
    onTabChange,
    accordionClassName = '',
    isSubmitting = false,
    areAllItemsSaved = false,
    buttonLabel = 'Submit',
    cardSubmitHandler,
}: TabViewCardProperties) {
    return (
        <div className="rounded-2xl border border-gray-600 bg-white shadow-sm mt-6">
            <div className="flex flex-col gap-4 px-4 pt-4 pb-2 md:flex-row md:items-center md:justify-between mb-6">
                <div className="space-y-2">
                    <HeaderTitle text={title} size="md" weight="medium" className="font-poppins" />
                    <RenderTotalAmount amount={amount} />
                </div>
                <DeadlineStatusChip
                    creationDate={creationDate}
                    showBackground
                    showDate
                    className="self-start md:self-auto px-[11px] py-[13px]"
                    dateClassName="text-[10px] text-black font-normal leading-4"
                    timelineEventName={timelineEventName}
                />
            </div>

            <div className="px-4 pb-4">
                <Accordion items={accordionItems} activeIndex={activeIndex} onTabChange={onTabChange} className={accordionClassName} />

                <ActionButton
                    width="auto"
                    borderRadius="rounded"
                    className="font-ubuntu mt-2 font-normal text-sm leading-5"
                    onClick={cardSubmitHandler}
                    isDisabled={!areAllItemsSaved || isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : `${buttonLabel}`}
                </ActionButton>
            </div>
        </div>
    );
}

export default TabViewCard;
