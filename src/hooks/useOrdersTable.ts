import { useState, useEffect } from 'react';
import type { DataTableRowClickEvent } from 'primereact/datatable';
import type { OrderRecord } from '../interfaces/orders/orders.types';
import type { SelectionChangeEvent } from '../interfaces/common/table.types';
import { useOrderDetail } from './transactions/orders/useOrders';

/**
 * Custom hook for managing orders table state and handlers.
 *
 * @returns An object containing state values and handler functions for the orders table.
 */
export function useOrdersTable() {
    const [selectedOrder, setSelectedOrder] = useState<OrderRecord | undefined>();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [orderIdToFetch, setOrderIdToFetch] = useState<string>('');

    // Use useApiQuery hook to fetch order detail
    const { orderDetail, isLoading: isFetchingDetail, error: detailErrorResponse, refetch: reFetchDetail } = useOrderDetail(orderIdToFetch);

    // Update selectedOrder when orderDetail is fetched
    useEffect(() => {
        if (orderDetail) {
            setSelectedOrder(orderDetail as OrderRecord);
        }
    }, [orderDetail]);

    const handleRowClick = (event: DataTableRowClickEvent) => {
        const order = event.data as OrderRecord | undefined;
        if (!order || !order.name) {
            return;
        }

        setSidebarVisible(true);
        setOrderIdToFetch(order.name); // This will trigger useOrderDetail to fetch
        // Use base order data immediately while detail loads
        setSelectedOrder(order);
    };

    const handleSelectionChange = (event: SelectionChangeEvent<OrderRecord>) => {
        const value = event.value as OrderRecord | OrderRecord[] | undefined;
        if (Array.isArray(value)) {
            setSelectedOrder(value[0] ?? undefined);
        } else {
            setSelectedOrder(value ?? undefined);
        }
    };

    const handleCloseSidebar = () => {
        setSidebarVisible(false);
        setOrderIdToFetch(''); // Clear order ID when closing
    };

    const retryFetchDetail = () => {
        if (orderIdToFetch) {
            reFetchDetail();
        }
    };

    // Convert error to string/Error format for compatibility
    const detailError = detailErrorResponse?.message;

    const isDrawerVisible = sidebarVisible && (!!selectedOrder || !!orderIdToFetch);

    return {
        selectedOrder,
        sidebarVisible,
        isDrawerVisible,
        isFetchingDetail,
        detailError,
        retryFetchDetail,
        handleRowClick,
        handleSelectionChange,
        handleCloseSidebar,
    };
}
