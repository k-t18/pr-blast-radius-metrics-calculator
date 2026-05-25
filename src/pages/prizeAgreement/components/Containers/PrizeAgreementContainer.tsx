import { useEffect, useRef } from 'react';
import type { SalesOrderWithItems } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';
import PrizeAgreementCard from './PrizeAgreementCard';
import type { NGOItem } from '../../../../interfaces/ngo/ngo.types';

interface PrizeAgreementContainerProperties {
    salesOrders: SalesOrderWithItems[];
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
    ngoList: NGOItem[];
    sponsorshipType: string;
}

function PrizeAgreementContainer({
    salesOrders,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    ngoList,
    sponsorshipType,
}: PrizeAgreementContainerProperties) {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    onLoadMore?.();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasNextPage, isFetchingNextPage, onLoadMore]);

    return (
        <div className="flex flex-col gap-1">
            {salesOrders.map(order => (
                <PrizeAgreementCard
                    key={order.name}
                    orderId={order.name}
                    totalAmount={order.grand_total}
                    items={order.items_with_status}
                    ngoList={ngoList}
                    creationDate={order.creation}
                    sponsorshipType={sponsorshipType}
                    sponsor={order.customer ?? ''}
                />
            ))}
            {/* Intersection Observer target - triggers loading when visible */}
            <div ref={observerTarget} className="h-4" />
            {isFetchingNextPage && <div className="p-4 text-center text-gray-500">Loading more...</div>}
        </div>
    );
}

export default PrizeAgreementContainer;
