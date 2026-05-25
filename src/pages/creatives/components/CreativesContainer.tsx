import { useEffect, useRef } from 'react';
import type { SalesOrderWithItems } from '../../../interfaces/prizeAgreement/prizeAgreement.types';
import CreativesOrderCard from './CreativesOrderCard';

interface CreativesContainerProperties {
    salesOrders: SalesOrderWithItems[];
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
    platform: 'mobile-game' | 'studio-show';
    onNavigateToSubmittedTab?: (platform: 'mobile-game' | 'studio-show') => void;
    onRefetchSalesOrders?: () => void;
}

function CreativesContainer({
    salesOrders,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    platform,
    onNavigateToSubmittedTab,
    onRefetchSalesOrders,
}: CreativesContainerProperties) {
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
                <CreativesOrderCard
                    key={order.name}
                    order={order}
                    platform={platform}
                    onNavigateToSubmittedTab={onNavigateToSubmittedTab}
                    onRefetchSalesOrders={onRefetchSalesOrders}
                />
            ))}
            <div ref={observerTarget} className="h-4" />
            {isFetchingNextPage && <div className="p-4 text-center text-gray-500">Loading more...</div>}
        </div>
    );
}

export default CreativesContainer;
