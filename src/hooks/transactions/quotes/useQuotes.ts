import { getQuotationDetail } from '../../../services/transactions/quotes/getQuotationDetail.api';
import { getQuotationsList, type GetQuotationsListParameters } from '../../../services/transactions/quotes/getQuotationsList.api';
import { useApiQuery } from '../../useApiQuery';
import type { ApiResponse } from '../../../services/api/apiClient';
import type { Quote } from '../../../interfaces/quotes/quotes.types';

/**
 * Hook to fetch a specific quote detail by ID using useApiQuery
 * @param quoteId - The quote ID to fetch
 * @returns Query result with quote detail data, loading state, and error
 */
export function useQuoteDetail(quoteId: string | undefined) {
    const {
        data: quoteDetailResponse,
        isLoading,
        error,
        refetch,
    } = useApiQuery<ApiResponse<Quote>>({
        queryKey: ['quote-detail', quoteId],
        queryFn: () => getQuotationDetail(quoteId!),
        enabled: !!quoteId, // Only fetch if quoteId exists
        gcTime: 0, // Disable cache - data is garbage collected immediately when unused
        staleTime: 0, // Data is immediately considered stale, forcing refetch
    });

    const quoteDetail = quoteDetailResponse?.data;

    return {
        quoteDetail,
        isLoading,
        error,
        refetch,
    };
}

interface UseQuotesParameters {
    id?: string;
    type?: string;
    limit?: number;
    offset?: number;
}

const useQuotesList = (parameters?: UseQuotesParameters) => {
    const {
        data: quotesData,
        isLoading,
        error,
        refetch,
    } = useApiQuery({
        queryKey: ['quotes-list', parameters?.type, parameters?.id, parameters?.limit, parameters?.offset],
        queryFn: () => {
            const apiParameters: GetQuotationsListParameters = {};
            if (parameters?.id) {
                apiParameters.id = parameters.id;
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
            return getQuotationsList(Object.keys(apiParameters).length > 0 ? apiParameters : undefined);
        },
        gcTime: 0, // Disable cache - data is garbage collected immediately when unused
        staleTime: 0, // Data is immediately considered stale, forcing refetch
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Quotes fetched successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error fetching quotes', error_);
        },
    });

    const quotesList = quotesData?.data ?? [];
    const totalCount = quotesData?.count ?? 0;

    return { quotesList, totalCount, isLoading, error, refetch };
};

export default useQuotesList;
