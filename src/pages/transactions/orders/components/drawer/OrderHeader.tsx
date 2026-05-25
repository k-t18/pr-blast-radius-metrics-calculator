import { CaretDoubleRightIcon } from '@phosphor-icons/react';
import type { OrderHeaderProperties } from '../../../../../interfaces/orders/orders.types';
import HeaderTitle from '../../../../../components/common/HeaderTitle';
import LinkButton from '../../../../../components/common/LinkButton';

export function OrderHeader({ order, onClose, activeIndex = 0 }: OrderHeaderProperties) {
    return (
        <header className="pb-4">
            <button type="button" onClick={onClose} className="cursor-pointer">
                <CaretDoubleRightIcon size={25} weight="bold" />
            </button>
            <div className="mt-3 flex items-center justify-between">
                <HeaderTitle text={`Order ID: ${order?.name}`} size="2xl" weight="medium" disabled={false} className="text-black leading-8" />
                {order?.is_prize_agreement_available ? (
                    <LinkButton
                        to={`/prize-agreement?order_id=${order.name}&tab=${activeIndex}`}
                        textColor="text-white"
                        width="auto"
                        className="p-2! h-fit w-fit text-xs font-normal leading-5 bg-brand-primary-500 border-none border-brand-primary-500 whitespace-nowrap rounded"
                    >
                        Create Prize Agreement
                    </LinkButton>
                ) : (
                    ''
                )}
            </div>
        </header>
    );
}
