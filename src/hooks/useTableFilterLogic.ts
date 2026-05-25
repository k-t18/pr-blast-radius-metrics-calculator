import { useState, useCallback } from 'react';

/**
 * Interface depending on the shape of filter objects coming from the UI component.
 */
export interface TableFilterItem<T extends string> {
    field: T;
    value: string;
}

export interface UseTableFilterLogicProperties {
    /**
     * Callback triggered when filters are applied or cleared (e.g., to reset pagination).
     */
    onFilterChange?: () => void;
}

/**
 * Custom hook to manage table filter state (selected parameters, tracked fields).
 * Replaces repetitive logic for handling apply/clear filters and tracking value text changes.
 */
export function useTableFilterLogic<T extends string = string>({ onFilterChange }: UseTableFilterLogicProperties = {}) {
    // The active filter parameters sent to the API
    const [filterParameters, setFilterParameters] = useState<Partial<Record<T, string>>>({});

    // Track which fields are currently being interacted with (for fetching specific options)
    const [selectedFields, setSelectedFields] = useState<Set<T>>(new Set());

    /**
     * Applies the given list of filters to the state.
     * Maps the array of filter objects to a key-value object.
     */
    const handleApplyFilters = useCallback(
        (filters: TableFilterItem<T>[]) => {
            const parameters: Partial<Record<T, string>> = {};

            filters.forEach(filter => {
                if (filter.value) {
                    parameters[filter.field] = filter.value;
                }
            });

            // Update state logic
            if (Object.keys(parameters).length === 0) {
                setFilterParameters({});
            } else {
                setFilterParameters(parameters);
            }

            // Trigger side effect (e.g. reset page)
            onFilterChange?.();
        },
        [onFilterChange]
    );

    /**
     * Clears all filter parameters and selected fields.
     */
    const handleClearFilters = useCallback(() => {
        setFilterParameters({});
        setSelectedFields(new Set());
        onFilterChange?.();
    }, [onFilterChange]);

    /**
     * Tracks when a user types in a filter field, marking it as selected.
     * Useful for lazily fetching filter options.
     */
    const handleValueTextChange = useCallback((field: T, _searchTerm?: string, _rowId?: number) => {
        setSelectedFields(previous => {
            const next = new Set(previous);
            next.add(field);
            return next;
        });
    }, []);

    return {
        filterParameters,
        setFilterParameters,
        selectedFields,
        setSelectedFields,
        handleApplyFilters,
        handleClearFilters,
        handleValueTextChange,
    };
}
