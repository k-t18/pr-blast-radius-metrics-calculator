import { useApiQuery } from '../../../../hooks/useApiQuery';
import {
    getPrizeAgreementList,
    type GetPrizeAgreementListParameters,
} from '../../../../services/transactions/prize-agreement/getPrizeAgreementList.api';

export interface UsePrizeAgreementListParameters {
    id?: string;
    quotation_id?: string;
    sales_order?: string;
    limit?: number;
    offset?: number;
}

/**
 * Hook to fetch prize agreement list with filter and pagination support.
 * Uses optimized caching strategy for better performance.
 */
export function usePrizeAgreementList(parameters?: UsePrizeAgreementListParameters) {
    const {
        data: prizeAgreementData,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: ['prize-agreement-list', parameters?.id, parameters?.quotation_id, parameters?.sales_order, parameters?.limit, parameters?.offset],
        queryFn: () => {
            const apiParameters: GetPrizeAgreementListParameters = {};

            if (parameters?.id) apiParameters.id = parameters.id;
            if (parameters?.quotation_id) apiParameters.quotation_id = parameters.quotation_id;
            if (parameters?.sales_order) apiParameters.sales_order = parameters.sales_order;
            if (parameters?.limit !== undefined) apiParameters.limit = parameters.limit;
            if (parameters?.offset !== undefined) apiParameters.offset = parameters.offset;

            return getPrizeAgreementList(Object.keys(apiParameters).length > 0 ? apiParameters : undefined);
        },
        gcTime: 0, // Disable cache - data is garbage collected immediately when unused
        staleTime: 0, // Data is immediately considered stale, forcing refetch
    });

    const prizeAgreementList = prizeAgreementData?.data ?? [];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const totalCount = (prizeAgreementData as any)?.count ?? 0;

    return { prizeAgreementList, totalCount, isLoading, error, refetch };
}
