import { useApiQuery } from '../useApiQuery';
import { getFilterOptions, type GetFilterOptionsParameters } from '../../services/transactions/getFilterOptions.api';
import useDebounce from '../useDebounce';

const DEBOUNCE_DELAY = 300; // milliseconds

export interface UseFilterOptionsParameters {
    doctypeName: string;
    searchTerm: string;
    enabled?: boolean;
    linkedDoctype?: string;
    linkField?: string;
}

/**
 * Hook to fetch filter options (document names) with debounced search.
 * @param parameters - Configuration object
 * @param parameters.doctypeName - The ERPNext doctype name (e.g., 'Quotation', 'Sales Order', 'Sales Invoice')
 * @param parameters.searchTerm - The search term for filtering document names
 * @param parameters.enabled - Whether the query should be enabled (default: true). Set to false to prevent API calls until field is selected.
 * @param parameters.linkedDoctype - Optional linked doctype name (e.g., 'Sales Order')
 * @param parameters.linkField - Optional link field name (e.g., 'custom_quotation')
 */
export function useFilterOptions({ doctypeName, searchTerm, enabled = true, linkedDoctype, linkField }: UseFilterOptionsParameters) {
    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

    const {
        data: filterOptionsResponse,
        isLoading,
        error,
    } = useApiQuery({
        queryKey: ['filter-options', doctypeName, debouncedSearchTerm, linkedDoctype, linkField],
        queryFn: () => {
            const parameters: GetFilterOptionsParameters = {
                doctype_name: doctypeName,
                document_name: debouncedSearchTerm || '',
            };
            if (linkedDoctype) {
                parameters.linked_doctype = linkedDoctype;
            }
            if (linkField) {
                parameters.link_field = linkField;
            }
            return getFilterOptions(parameters);
        },
        enabled, // Only fetch when enabled
    });

    // Return the raw API data format: [{name: "..."}, {name: "..."}]
    const filterOptions = filterOptionsResponse?.data ?? [];

    return {
        filterOptions,
        isLoading,
        error,
    };
}
