import { useApiQuery } from '../../useApiQuery';
import { getOrdersList, type GetOrdersListParameters } from '../../../services/transactions/orders/getOrdersList.api';
import { getOrderDetail } from '../../../services/transactions/orders/getOrderDetail.api';
import type { ApiResponse } from '../../../services/api/apiClient';
import type { OrderRecord } from '../../../interfaces/orders/orders.types';

/**
 * Hook to fetch a specific order detail by ID using useApiQuery
 * @param orderId - The order ID to fetch
 * @returns Query result with order detail data, loading state, and error
 */
export function useOrderDetail(orderId: string | undefined) {
    const {
        data: orderDetailResponse,
        isLoading,
        error,
        refetch,
    } = useApiQuery<ApiResponse<OrderRecord>>({
        queryKey: ['order-detail', orderId],
        queryFn: () => getOrderDetail(orderId!),
        enabled: !!orderId, // Only fetch if orderId exists
        gcTime: 0, // Disable cache - data is garbage collected immediately when unused
        staleTime: 0, // Data is immediately considered stale, forcing refetch
    });

    const orderDetail = orderDetailResponse?.data;

    return {
        orderDetail,
        isLoading,
        error,
        refetch,
    };
}

interface UseOrdersParameters {
    id?: string;
    order_id?: string;
    type?: string;
    limit?: number;
    offset?: number;
}

const useOrdersList = (parameters?: UseOrdersParameters) => {
    const {
        data: orderData,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: ['orders-list', parameters?.type, parameters?.id, parameters?.order_id, parameters?.limit, parameters?.offset],
        queryFn: () => {
            const apiParameters: GetOrdersListParameters = {};
            if (parameters?.id) {
                apiParameters.id = parameters.id;
            }
            if (parameters?.order_id) {
                apiParameters.order_id = parameters.order_id;
            }
            if (parameters?.type) {
                apiParameters.type = parameters.type;
            }
            if (parameters?.limit !== undefined) {
                apiParameters.limit = parameters.limit;
            }
            if (parameters?.offset !== undefined) {
                apiParameters.offset = parameters.offset;
            }
            return getOrdersList(Object.keys(apiParameters).length > 0 ? apiParameters : undefined);
        },
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Orders fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching orders', error_);
        },
    });

    const ordersList = orderData?.data ?? [];
    const totalCount = orderData?.count ?? 0;

    return { ordersList, totalCount, isLoading, error, refetch };
};

export default useOrdersList;
