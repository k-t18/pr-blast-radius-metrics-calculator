import type { OrderSidebarProperties } from '../../../../interfaces/orders/orders.types';
import { OrderHeader } from './drawer/OrderHeader';
import { OrderBody } from './drawer/OrderBody';
import { OrderFooter } from './drawer/OrderFooter';
import CircularLoader from '../../../../components/common/CircularLoader';
import ErrorBanner from '../../../../components/common/ErrorBanner';

export function OrderSidebar({ order, onClose, isFetchingDetail, detailError, retryFetchDetail, activeIndex = 0 }: OrderSidebarProperties) {
    if (isFetchingDetail) {
        return <CircularLoader label="Loading order details…" />;
    }
    if (detailError) {
        return (
            <div className="p-6">
                <ErrorBanner message={detailError} onRetry={retryFetchDetail} />
            </div>
        );
    }
    if (!order || Object.keys(order).length === 0) {
        return <div className="p-4 text-gray-600">No Sales order data available</div>;
    }
    return (
        <div className="custom-detail-sidebar">
            {order ? (
                <div className="mt-4 flex h-full flex-col">
                    <OrderHeader order={order} onClose={onClose} activeIndex={activeIndex} />
                    <OrderBody order={order} />
                    <OrderFooter order={order} />
                </div>
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-black">Select an order to view its details.</div>
            )}
        </div>
    );
}
