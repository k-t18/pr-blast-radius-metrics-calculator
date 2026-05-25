import { useMemo } from 'react';
import {
    getBlanketOrderList,
    type BlanketOrderListItem,
    type BlanketOrderListResponse,
    type GetBlanketOrderListParameters,
} from '../../services/blanketSponsorship/getBlanketOrderList.api';
import { getPeriod, type PeriodResponse } from '../../services/blanketSponsorship/getPeriod.api';
import type { DropdownOption } from '../../components/common/Dropdown';
import { useApiQuery } from '../useApiQuery';

interface UseBlanketOrdersParameters {
    id?: string;
    limit?: number;
    offset?: number;
}

/**
 * Custom hook for fetching blanket orders list with pagination
 */
export function useBlanketOrders(parameters?: UseBlanketOrdersParameters) {
    const {
        data: blanketOrders,
        isLoading,
        error,
        refetch,
    } = useApiQuery<BlanketOrderListResponse>({
        queryKey: ['blanket-orders', parameters?.id, parameters?.limit, parameters?.offset],
        queryFn: () => {
            const apiParameters: GetBlanketOrderListParameters = {};
            if (parameters?.id) {
                apiParameters.id = parameters.id;
            }
            if (parameters?.limit !== undefined) {
                apiParameters.limit = parameters.limit;
            }
            if (parameters?.offset !== undefined) {
                apiParameters.offset = parameters.offset;
            }
            return getBlanketOrderList(Object.keys(apiParameters).length > 0 ? apiParameters : undefined);
        },
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Blanket orders fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching blanket orders', error_);
        },
    });

    // Transform API data to table records
    const orders: BlanketOrderListItem[] = blanketOrders?.data || [];
    const totalCount = blanketOrders?.count ?? 0;

    return {
        orders,
        isLoading,
        error,
        totalCount,
        refetch,
    };
}

/**
 * Custom hook for fetching approved blanket orders eligible for attaching to a quotation.
 * Filters server-side by status=approved and client-side by minBudget.
 */
export function useApprovedBlanketOrders(minBudget: number) {
    const {
        data: blanketOrders,
        isLoading,
        error,
    } = useApiQuery<BlanketOrderListResponse>({
        queryKey: ['blanket-orders-approved'],
        queryFn: () => getBlanketOrderList({ status: 'approved' }),
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching approved blanket orders', error_);
        },
    });

    const allApprovedOrders: BlanketOrderListItem[] = blanketOrders?.data || [];

    const eligibleOrders = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return allApprovedOrders.filter(order => {
            if (order.rate < minBudget) return false;

            const startDate = new Date(order.start_date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + Number.parseInt(order.duration, 10));

            return today >= startDate && today <= endDate;
        });
    }, [allApprovedOrders, minBudget]);

    return {
        orders: eligibleOrders,
        isLoading,
        error,
    };
}

/**
 * Custom hook for fetching period options for blanket sponsorship duration dropdown
 */
export function usePeriodOptions() {
    const {
        data: periodOptions,
        isLoading,
        error,
    } = useApiQuery<PeriodResponse>({
        queryKey: ['period-options'],
        queryFn: getPeriod,
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Period options fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching period options', error_);
        },
    });

    // Transform API data to DropdownOption format
    // Extract number from name (handles both "30" and "12 Months" formats)
    const options: DropdownOption[] =
        periodOptions?.data?.map(option => {
            return {
                label: option.name,
                value: option.label,
            };
        }) || [];

    return {
        options,
        isLoading,
        error,
    };
}
