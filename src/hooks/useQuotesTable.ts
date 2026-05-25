import { useState, useEffect } from 'react';
import type { DataTableRowClickEvent } from 'primereact/datatable';
import type { Quote } from '../interfaces/quotes/quotes.types';
import type { SelectionChangeEvent } from '../interfaces/common/table.types';
import { useQuoteDetail } from './transactions/quotes/useQuotes';

/**
 * Custom hook for managing quotes table state and handlers.
 *
 * @returns An object containing state values and handler functions for the quotes table.
 */
export function useQuotesTable() {
    const [selectedQuote, setSelectedQuote] = useState<Quote | undefined>();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [quoteIdToFetch, setQuoteIdToFetch] = useState<string>('');

    // Use useApiQuery hook to fetch quote detail
    const { quoteDetail, isLoading: isFetchingDetail, error: detailErrorResponse, refetch: reFetchDetail } = useQuoteDetail(quoteIdToFetch as string);

    // Update selectedQuote when quoteDetail is fetched
    useEffect(() => {
        if (quoteDetail) {
            setSelectedQuote(quoteDetail as Quote);
        }
    }, [quoteDetail]);

    const handleRowClick = (event: DataTableRowClickEvent) => {
        const quote = event.data as Quote | undefined;
        if (!quote || !quote.name) {
            return;
        }

        setSidebarVisible(true);
        setQuoteIdToFetch(quote.name); // This will trigger useQuoteDetail to fetch
        // Use base quote data immediately while detail loads
        setSelectedQuote(quote);
    };

    const handleSelectionChange = (event: SelectionChangeEvent<Quote>) => {
        const value = event.value as Quote | Quote[] | undefined;
        if (Array.isArray(value)) {
            setSelectedQuote(value[0] ?? undefined);
        } else {
            setSelectedQuote(value ?? undefined);
        }
    };

    const handleCloseSidebar = () => {
        setSidebarVisible(false);
        setQuoteIdToFetch(''); // Clear quote ID when closing
    };

    const retryFetchDetail = () => {
        if (quoteIdToFetch) {
            reFetchDetail();
        }
    };

    // Convert error to string/Error format for compatibility
    const detailError = detailErrorResponse?.message;

    const isDrawerVisible = sidebarVisible && (!!selectedQuote || !!quoteIdToFetch);

    return {
        selectedQuote,
        sidebarVisible,
        isDrawerVisible,
        isFetchingDetail,
        detailError,
        retryFetchDetail,
        setSelectedQuote,
        setSidebarVisible,
        handleRowClick,
        handleSelectionChange,
        handleCloseSidebar,
    };
}
