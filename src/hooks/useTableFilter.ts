import { useState } from 'react';
import type { FilterType } from '../interfaces/common/table.types';

/**
 * Custom hook for managing table filter state and handlers.
 *
 * @returns An object containing the active filter, select handler, and clear handler.
 */
export function useTableFilter() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('');

    const handleFilterSelect = (filterType: Exclude<FilterType, ''>) => {
        setActiveFilter(filterType);
    };

    const handleClearFilter = () => {
        setActiveFilter('');
    };

    return {
        activeFilter,
        handleFilterSelect,
        handleClearFilter,
    };
}
